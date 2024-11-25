import os
import ftplib
import imaplib
import email
import requests
import tempfile
from typing import BinaryIO, Dict, Any, List, Tuple
from bs4 import BeautifulSoup
from fastapi import HTTPException

class ImportSource:
    """Base class for import sources"""
    @staticmethod
    async def get_file() -> Tuple[BinaryIO, str]:
        """Return file-like object and filename"""
        raise NotImplementedError

class FTPSource(ImportSource):
    """Handle FTP/SFTP imports"""
    def __init__(self, host: str, username: str, password: str, path: str, is_sftp: bool = False):
        self.host = host
        self.username = username
        self.password = password
        self.path = path
        self.is_sftp = is_sftp

    async def get_file(self) -> Tuple[BinaryIO, str]:
        try:
            # Create a temporary file to store the download
            temp_file = tempfile.NamedTemporaryFile(delete=False)
            
            if self.is_sftp:
                # TODO: Implement SFTP using paramiko
                raise NotImplementedError("SFTP not yet implemented")
            else:
                # Use FTP
                with ftplib.FTP(self.host) as ftp:
                    ftp.login(self.username, self.password)
                    ftp.retrbinary(f"RETR {self.path}", temp_file.write)
            
            temp_file.seek(0)
            filename = os.path.basename(self.path)
            return temp_file, filename
        
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error downloading from FTP: {str(e)}"
            )

class APISource(ImportSource):
    """Handle external API imports"""
    def __init__(self, url: str, method: str = "GET", headers: Dict[str, str] = None, 
                 params: Dict[str, Any] = None, data: Dict[str, Any] = None):
        self.url = url
        self.method = method
        self.headers = headers or {}
        self.params = params or {}
        self.data = data or {}

    async def get_file(self) -> Tuple[BinaryIO, str]:
        try:
            response = requests.request(
                method=self.method,
                url=self.url,
                headers=self.headers,
                params=self.params,
                json=self.data
            )
            response.raise_for_status()
            
            # Create a temporary file with the response content
            temp_file = tempfile.NamedTemporaryFile(delete=False)
            temp_file.write(response.content)
            temp_file.seek(0)
            
            # Generate filename from URL
            filename = f"api_import_{hash(self.url)}.json"
            return temp_file, filename
        
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error fetching from API: {str(e)}"
            )

class WebScraperSource(ImportSource):
    """Handle web scraping imports"""
    def __init__(self, url: str, selectors: Dict[str, str]):
        self.url = url
        self.selectors = selectors

    async def get_file(self) -> Tuple[BinaryIO, str]:
        try:
            # Fetch webpage
            response = requests.get(self.url)
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract data using selectors
            data = []
            items = soup.select(self.selectors.get('item_container', 'body'))
            
            for item in items:
                item_data = {}
                for field, selector in self.selectors.items():
                    if field != 'item_container':
                        element = item.select_one(selector)
                        item_data[field] = element.text.strip() if element else None
                data.append(item_data)
            
            # Create temporary file with scraped data
            temp_file = tempfile.NamedTemporaryFile(delete=False)
            temp_file.write(str(data).encode())
            temp_file.seek(0)
            
            filename = f"scrape_{hash(self.url)}.json"
            return temp_file, filename
        
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error scraping website: {str(e)}"
            )

class EmailSource(ImportSource):
    """Handle email attachment imports"""
    def __init__(self, host: str, username: str, password: str, 
                 folder: str = "INBOX", search_criteria: str = "ALL"):
        self.host = host
        self.username = username
        self.password = password
        self.folder = folder
        self.search_criteria = search_criteria

    async def get_file(self) -> Tuple[BinaryIO, str]:
        try:
            # Connect to email server
            mail = imaplib.IMAP4_SSL(self.host)
            mail.login(self.username, self.password)
            mail.select(self.folder)
            
            # Search for emails
            _, message_numbers = mail.search(None, self.search_criteria)
            
            if not message_numbers[0]:
                raise HTTPException(
                    status_code=404,
                    detail="No emails found matching criteria"
                )
            
            # Get the latest email
            latest_email_id = message_numbers[0].split()[-1]
            _, msg_data = mail.fetch(latest_email_id, "(RFC822)")
            email_body = msg_data[0][1]
            message = email.message_from_bytes(email_body)
            
            # Find and save attachment
            for part in message.walk():
                if part.get_content_maintype() == 'multipart':
                    continue
                if part.get('Content-Disposition') is None:
                    continue
                
                filename = part.get_filename()
                if filename:
                    # Save attachment to temporary file
                    temp_file = tempfile.NamedTemporaryFile(delete=False)
                    temp_file.write(part.get_payload(decode=True))
                    temp_file.seek(0)
                    return temp_file, filename
            
            raise HTTPException(
                status_code=404,
                detail="No attachments found in email"
            )
        
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error processing email: {str(e)}"
            )
