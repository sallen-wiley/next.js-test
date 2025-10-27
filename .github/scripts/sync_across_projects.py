import os
import subprocess
from pathlib import Path

folders = [
    Path.home() / "Documents/nonlinear/.github",
    Path.home() / "Documents/nonlinear/resources",
    Path.home() / "Documents/praxis/.github",
    Path.home() / "Documents/wiley/storybook/.github",
    Path.home() / "Documents/notes/.github"
]

def get_latest_folder(folders):
    latest_time = 0
    latest_folder = None
    for folder in folders:
        for root, _, files in os.walk(folder):
            for f in files:
                fp = os.path.join(root, f)
                mtime = os.path.getmtime(fp)
                if mtime > latest_time:
                    latest_time = mtime
                    latest_folder = folder
    return latest_folder

def sync_folders(source, targets):
    for target in targets:
        if target != source:
            subprocess.run([
                "rsync", "-av", "--delete", "--exclude", "copilot-instructions.md", f"{source}/", f"{target}/"
            ])

if __name__ == "__main__":
    latest = get_latest_folder(folders)
    print(f"Syncing from: {latest}")
    sync_folders(latest, folders)
    print("Sync complete.")
