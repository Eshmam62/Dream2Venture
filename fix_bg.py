from PIL import Image
import numpy as np
from collections import deque

# Load original intact image
orig = Image.open('public/heros_pic.png').convert('RGB')
arr = np.array(orig)
h, w, _ = arr.shape

# Mask only dark pixels connected to outer borders (flood fill)
visited = np.zeros((h, w), dtype=bool)
bg_mask = np.zeros((h, w), dtype=bool)
queue = deque()

# Push image edges to queue
for x in range(w):
    queue.append((0, x))
    queue.append((h - 1, x))
for y in range(h):
    queue.append((y, 0))
    queue.append((y, w - 1))

while queue:
    y, x = queue.popleft()
    if visited[y, x]:
        continue
    visited[y, x] = True
    
    # Check if pixel is background (near black)
    r, g, b = int(arr[y, x, 0]), int(arr[y, x, 1]), int(arr[y, x, 2])
    if max(r, g, b) < 22:
        bg_mask[y, x] = True
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                queue.append((ny, nx))

# Create clean RGBA
rgba = np.dstack((arr, np.where(bg_mask, 0, 255).astype(np.uint8)))
clean_img = Image.fromarray(rgba, 'RGBA')

# Trim outer empty space
bbox = clean_img.getbbox()
if bbox:
    clean_img = clean_img.crop(bbox)

clean_img.save('public/heros_pic_transparent.png', 'PNG')
print('Artifacts fixed successfully!')
