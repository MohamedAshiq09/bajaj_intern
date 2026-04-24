const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/bfhl', (req, res) => {
    const data = req.body.data || [];
    
    const validEdges = [];
    const invalidEntries = [];
    const duplicateEdges = [];
    const seen = new Set();
    
    for (let str of data) {
        if (!str && str !== '') {
            invalidEntries.push(str);
            continue;
        }
        
        const trimmed = typeof str === 'string' ? str.trim() : String(str);
        
        if (!/^[A-Z]->[A-Z]$/.test(trimmed)) {
            invalidEntries.push(str);
            continue;
        }
        
        if (trimmed[0] === trimmed[3]) {
            invalidEntries.push(str);
            continue;
        }
        
        if (seen.has(trimmed)) {
            if (!duplicateEdges.includes(trimmed)) {
                duplicateEdges.push(trimmed);
            }
            continue;
        }
        
        seen.add(trimmed);
        validEdges.push(trimmed);
    }
    
    const graph = {};
    const childSet = new Set();
    const childParents = {};
    
    for (let edge of validEdges) {
        const [parent, child] = edge.split('->');
        
        if (childParents[child]) {
            continue;
        }
        
        if (!graph[parent]) graph[parent] = [];
        graph[parent].push(child);
        childSet.add(child);
        childParents[child] = parent;
    }
    
    const nodes = new Set();
    validEdges.forEach(e => {
        const [p, c] = e.split('->');
        nodes.add(p);
        nodes.add(c);
    });
    
    let roots = [...nodes].filter(n => !childSet.has(n));
    
    if (roots.length === 0 && nodes.size > 0) {
        roots = [[...nodes].sort()[0]];
    }
    
    function buildTree(node, visited, stack) {
        if (stack.has(node)) return { cycle: true };
        
        stack.add(node);
        
        let tree = {};
        
        if (graph[node]) {
            for (let child of graph[node]) {
                const res = buildTree(child, visited, stack);
                if (res.cycle) return { cycle: true };
                
                tree[child] = res.tree;
            }
        }
        
        stack.delete(node);
        visited.add(node);
        
        return { tree };
    }
    
    function getDepth(tree) {
        if (!tree || Object.keys(tree).length === 0) return 0;
        
        let max = 0;
        for (let key in tree) {
            max = Math.max(max, getDepth(tree[key]));
        }
        return max + 1;
    }
    
    const hierarchies = [];
    const processedNodes = new Set();
    
    for (let root of roots) {
        if (processedNodes.has(root)) continue;
        
        const visited = new Set();
        const stack = new Set();
        
        const result = buildTree(root, visited, stack);
        
        visited.forEach(n => processedNodes.add(n));
        
        if (result.cycle) {
            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });
        } else {
            const depth = 1 + getDepth(result.tree);
            
            hierarchies.push({
                root,
                tree: { [root]: result.tree },
                depth
            });
        }
    }
    
    const totalTrees = hierarchies.filter(h => !h.has_cycle).length;
    const totalCycles = hierarchies.filter(h => h.has_cycle).length;
    
    let largestTreeRoot = "";
    let maxDepth = 0;
    
    for (let h of hierarchies) {
        if (!h.has_cycle) {
            if (h.depth > maxDepth || (h.depth === maxDepth && (!largestTreeRoot || h.root < largestTreeRoot))) {
                maxDepth = h.depth;
                largestTreeRoot = h.root;
            }
        }
    }
    
    res.json({
        user_id: "mohamedashiq_09",
        email_id: "mohamedashiq782@gmail.com",
        college_roll_number: "RA2311026020009",
        hierarchies,
        invalid_entries: invalidEntries,
        duplicate_edges: duplicateEdges,
        summary: {
            total_trees: totalTrees,
            total_cycles: totalCycles,
            largest_tree_root: largestTreeRoot
        }
    });
});

app.get('/', (req, res) => {
    res.send('API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
