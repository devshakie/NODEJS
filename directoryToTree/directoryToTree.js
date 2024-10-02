const path = require('path');
const fs = require('fs').promises;

async function directoryToTree(rootDir, depth){
    const rootPath = path.resolve(rootDir);
    async function buildTree(currentDir, currentDepth) {
        
        const name = path.basename(currentDir);

        const stats = await fs.stat(currentDir);

        //create the base object
        const node = {
            name: name,
            path: path.relative(rootDir, currentDir),
            type: stats.isDirectory() ? 'dir' : 'file',
            size: stats.size,
        };

        if (stats.isDirectory()) {
            node.children = [];
            if (currentDepth < depth) {
                const items = await fs.readdir(currentDir);
                for (const item of items) {
                    const childPath = path.join(currentDir, item);
                    const childNode = await buildTree(childPath, currentDepth + 1);

                    node.children.push(childNode);

                }
            }
        }
        return node;


    }
    return buildTree(rootDir, 0);
}


//directoryToTree('./dummy_dir', 2).then(tree => console.log(JSON.stringify(tree, null, 2)));

module.exports = directoryToTree;