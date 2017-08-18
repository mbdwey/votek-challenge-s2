var path = require('path');
// read invalid file may break the app, I don't like to require json file
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://bdwey:6FcvIroLkJ7lCMR3SEjY@ds145283.mlab.com:45283/votek',{useMongoClient: true});
// mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

// var treeNodeSchema = new Schema({
//     id: Number,
//     title: String,
//     nodeID: String,
//     children: {
//         type: Schema.Types.ObjectId,
//         ref: 'TreeNode'
//     },
// });
// var treeSchema = new Schema({
//     id: Number,
//     title: String,
//     created: {
//       type: Date,
//       default: Date.now
//     },
//     children: {
//         type: Schema.Types.ObjectId,
//         ref: 'TreeNode'
//     },
// });


// var TreeNode = mongoose.model('TreeNode', treeNodeSchema, 'treeNode');
// var Tree = mongoose.model('Tree', treeSchema, 'tree');



// No time for relational like design, Just save it as object
var openTreeSchema = new Schema({
    id: Number,
    tree_title: String,
    created: {
      type: Date,
      default: Date.now
    },
    children: Array,
});
var openTree = mongoose.model('openTree', openTreeSchema, 'openTree');



dbHelper = {
    treeModel: openTree,
    getTreesList: function(cb)
    {
        openTree.find(function (err, trees) {
          cb(err,trees)
        });
    },
    saveFromJsonFile: function(jsonContent,cb)
    {
        if (!jsonContent.tree_title)
        {
            return false;
        }
        tree  = new openTree({
            tree_title:jsonContent.tree_title,
            children : jsonContent.children
        });
        tree.save();
        return true;
        // console.log('a Tree',jsonContent);

    }
    // saveFromJsonFile: function(jsonContent,cb)
    // {
    //     if (!jsonContent.tree_title)
    //     {
    //         return false;
    //     }
    //     // console.log('a Tree',jsonContent);


    //     tree  = new Tree({
    //         title:jsonContent.tree_title
    //     });
    //     tree.save();
    //     function createChiled(item) {
    //         if (!this.children)
    //         {
    //             this.children = [];
    //             this.save();
    //         }
    //         childModel = new TreeNode({
    //             title:item.title,
    //             nodeID:item.id
    //         });
    //         childModel.save();
    //         // get parent from this ref
    //         this.children.addToSet(childModel);
    //         this.save();
    //         if (item.children && item.children.length > 0)
    //         {
    //           item.children.map(createChiled,childModel);
    //         }
    //     }
    //     jsonContent.children.map(createChiled,tree);
    //     return true;
    // }
}

module.exports = dbHelper;
