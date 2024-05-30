import os
from bs4 import BeautifulSoup

def read_html_files(folder_path):
    files = os.listdir(folder_path)
    html_files = [file for file in files if file.endswith('.html')]
    
    for html_file in html_files:
        file_path = os.path.join(folder_path, html_file)
        
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        
        timestamp_element = soup.find(id='timestamp')
        
        if timestamp_element:
            timestamp = timestamp_element.get_text(strip=True)
        else:
            timestamp = 'No timestamp element found'
        
        print(f"<div class='post_link' id='{html_file.strip('.html')}'>{timestamp}: <a href='html/{html_file}' target='_blank'>{html_file.strip('.html')}</a></div>")

folder_path = './'
read_html_files(folder_path)