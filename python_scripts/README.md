# Python Scripts

Place your Python scripts in this folder to use them with the application.

## Structure

- Each `.py` file in this folder can be executed from the backend
- Scripts can print output which will appear in the Terminal (bottom-right corner)
- Errors and exceptions will be caught and displayed in the Terminal

## Usage

1. Create a Python script in this folder (e.g., `dashboard.py`)
2. From the application, call the backend API to execute it:
   ```javascript
   fetch('/api/execute-python', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ script: 'dashboard.py' })
   })
   ```
3. The output will appear in the Terminal on the right side of the screen

## Example

See `example.py` for a simple example that prints messages.

## Tips

- Use `print()` to output messages that will show in the Terminal
- Errors are automatically caught and displayed
- You can pass arguments to scripts if needed
