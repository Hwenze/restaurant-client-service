const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const path = require('path');


function getPath(dir){
    return path.join(__dirname,dir);
}

const config = {
    mode:'development',
    entry:'/index.js',
    target:'node',
}