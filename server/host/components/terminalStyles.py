from rich import print
from rich.console import Console
from rich.style import Style
from rich.text import Text

# Create a custom Console with global styles
console = Console()

# Define custom styles for different message types
connection_style = Style(color="green")
error_style = Style(color="red")
info_style = Style(color="cyan")

def header(name="*", message="A Connection was detected."):
    console.print(f"[bold {connection_style}]{name}[/bold {connection_style}] -> {message}")

def error(name="*", message="An error was detected."):
    console.print(f"[bold {connection_style}]{name}[/bold {connection_style}] -> ([{error_style}]ERROR:[/{error_style}]) {message}")

def info(name="*", message="An info was detected."):
    console.print(f"[bold {connection_style}]{name}[/bold {connection_style}] -> ([{info_style}]INFO:[/{info_style}]) {message}")
