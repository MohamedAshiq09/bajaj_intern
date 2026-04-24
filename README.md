# BFHL Hierarchy Analyzer

A full-stack application that processes hierarchical node relationships, detects cycles, and visualizes tree structures. Built for the Bajaj Finserv Health challenge.

## What It Does

Give it node relationships like `A->B, B->C, C->D` and it will:
- Build the tree structure
- Calculate depth (number of nodes on the longest path)
- Detect cycles
- Identify invalid entries
- Show duplicate edges
- Display everything in a clean, visual interface

## Live Demo

- **Frontend**: https://bajajintern.vercel.app/
- **Backend API**: https://bajaj-intern-api.onrender.com

## Tech Stack

**Backend**
- Node.js + Express
- CORS enabled for cross-origin requests
- Deployed on Render

**Frontend**
- Next.js 14 with React 18
- CSS Modules for styling
- Deployed on Vercel

## Project Structure

```
├── backend/
│   ├── index.js          # API logic and tree processing
│   └── package.json
│
└── client/
    ├── app/
    │   ├── page.js       # Main UI component
    │   ├── layout.js     # App layout
    │   └── globals.css   # Styles
    └── package.json
```

## Running Locally

**Backend:**
```bash
cd backend
npm install
npm start
```
Runs on http://localhost:3000

**Frontend:**
```bash
cd client
npm install
npm run dev
```
Runs on http://localhost:3000 (or 3001 if 3000 is taken)

## API Usage

**Endpoint:** `POST /bfhl`

**Request:**
```json
{
  "data": ["A->B", "B->C", "X->Y", "Y->Z"]
}
```

**Response:**
```json
{
  "user_id": "mohamedashiq_09",
  "email_id": "mohamedashiq782@gmail.com",
  "college_roll_number": "RA2311026020009",
  "hierarchies": [
    {
      "root": "A",
      "tree": { "A": { "B": { "C": {} } } },
      "depth": 3
    },
    {
      "root": "X",
      "tree": { "X": { "Y": { "Z": {} } } },
      "depth": 3
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 2,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

## Features

**Validation**
- Only accepts format `X->Y` where X and Y are single uppercase letters
- Rejects self-loops, invalid formats, and multi-character nodes

**Tree Building**
- Handles multiple independent trees
- Detects root nodes automatically
- Manages multi-parent scenarios (first parent wins)

**Cycle Detection**
- Identifies circular relationships
- Returns empty tree structure for cyclic groups

**Depth Calculation**
- Counts nodes on the longest root-to-leaf path
- Example: A→B→C→D has depth 4

**UI Features**
- Real-time API integration
- Visual tree display with proper indentation
- Summary cards for quick insights
- Error handling and loading states
- Responsive design

## Deployment

**Backend (Render):**
1. Push backend folder to GitHub
2. Create new Web Service on Render
3. Connect repo and deploy

**Frontend (Vercel):**
1. Push client folder to GitHub
2. Import repo in Vercel
3. Auto-deploys on every push

## Testing

Try these inputs:

**Simple tree:**
```
A->B, B->C, C->D
```
Expected: 1 tree, depth 4

**Multiple trees:**
```
A->B, B->C, X->Y, Y->Z
```
Expected: 2 trees, both depth 3

**With cycle:**
```
A->B, B->C, C->A
```
Expected: 1 cycle detected

**With invalid entries:**
```
A->B, hello, 1->2, AB->C
```
Expected: 1 valid tree, 3 invalid entries

## Author

Mohamed Ashiq  
RA2311026020009  
mohamedashiq782@gmail.com
ss8669@srmist.edu.in
