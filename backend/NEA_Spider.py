import scrapy
from datetime import datetime
import os
import glob

class UlSpider(scrapy.Spider):
    name = "mk2_spider"

    # Define the start URLs
    start_urls = [
        'https://www.oecd-nea.org/jcms/pl_66130/ukraine-current-status-of-nuclear-power-installations',
    ]

    # Directory to store the output files
    output_directory = "/user/home/Documents/Scrape_Results/"
    
    # Generate a unique filename with a timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')  # Format: YYYYMMDD_HHMMSS
    output_filename = f"{output_directory}NEA_Bulletin_Update_{timestamp}.json"

    # Custom settings to include the dynamic output file
    custom_settings = {
        'FEED_FORMAT': 'json',  # Output format (json, csv, xml, etc.)
        'FEED_URI': output_filename,  # Dynamic output file path with timestamp
        'LOG_LEVEL': 'INFO',  # Set log level to display essential logs
    }
    
    # Maximum number of files to keep in the output directory
    max_files = 100

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.manage_output_files()

    def parse(self, response):
        # Extract text content from <li> tags within <ul>
        li_tags = response.xpath('//li//text()').extract()

        # Clean up extracted text to remove extra whitespaces
        li_tags = [text.strip() for text in li_tags if text.strip()]
        
        # Yield the extracted list items as a dictionary
        yield {
            'li_tags': li_tags
        }

    def manage_output_files(self):
        """
        Manages the number of output files in the directory, keeping only the latest 'max_files' files.
        """
        # Get a list of all JSON files in the output directory sorted by modification time
        file_list = sorted(
            glob.glob(f"{self.output_directory}*.json"), 
            key=os.path.getmtime
        )

        # Check if the number of files exceeds the max_files limit
        if len(file_list) > self.max_files:
            # Calculate how many files to delete
            files_to_delete = len(file_list) - self.max_files

            # Delete the oldest files
            for file_path in file_list[:files_to_delete]:
                try:
                    os.remove(file_path)
                    self.logger.info(f"Deleted old file: {file_path}")
                except Exception as e:
                    self.logger.error(f"Error deleting file {file_path}: {e}")
