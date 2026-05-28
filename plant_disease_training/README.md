# Plant Disease Training Workspace

This folder is separate from the website code.

## Folder Use

- `dataset/`: put your training dataset here.
- `model/`: stores model architecture, labels, plots, and training metadata.
- `trained_model/`: stores the final trained `.keras` model.

## Dataset Format

Use one folder per class:

```text
dataset/
  Tomato___Early_blight/
    image1.jpg
    image2.jpg
  Tomato___healthy/
    image1.jpg
  Potato___Late_blight/
    image1.jpg
```

Open `Plant_Disease_Training.ipynb` and run the cells from top to bottom.
