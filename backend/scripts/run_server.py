#!/usr/bin/env python3
"""
Production-ready server runner with proper configuration
"""

import uvicorn
import os
import sys
from pathlib import Path

# Add backend to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

def main():
    """Run the FastAPI server with production settings"""
    
    # Environment configuration
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 8000))
    workers = int(os.getenv('WORKERS', 1))
    reload = os.getenv('RELOAD', 'false').lower() == 'true'
    log_level = os.getenv('LOG_LEVEL', 'info')
    
    print(f"Starting Atlas-Alert FastAPI server...")
    print(f"Host: {host}")
    print(f"Port: {port}")
    print(f"Workers: {workers}")
    print(f"Reload: {reload}")
    print(f"Log Level: {log_level}")
    
    # Run server
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        workers=workers if not reload else 1,
        reload=reload,
        log_level=log_level,
        access_log=True,
        use_colors=True
    )

if __name__ == "__main__":
    main()
