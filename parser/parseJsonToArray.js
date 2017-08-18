
function getItemIndexByID(items,itemID) {
  return items.findIndex(function(item,index){
    return item.id == this.id;
  },{id:itemID});
}

/*
  calculate all previous items
 */
function computeItemOrder(items,item) {
  var order = 0;
  while((privousItemIndex = getNextItem(items,item)) >= 0)
  {
    order++;
    item = items[privousItemIndex];
  }
  return order;
}

/*
  find root item direction (left, up)
 */
function findRoot(items,item) {
  while((privousItemIndex = getPrivousItem(items,item)) >= 0)
  {
    item = items[privousItemIndex];
    while((privousRootIndex = getPrivousParent(items,item)) >= 0)
    {
      item = items[privousRootIndex];
    }
  }
  return item;
}
/*
  array method array parent @ multidimensional array
 */
function findParent(item,master) {
    var member, i, array;
    // if (master.id == 'INIT')
    // {
    //   return master;
    // }
    for (member in master) {
        if (master.hasOwnProperty(member) && typeof master[member] === 'object' && master[member] instanceof Array) {
            array = master[member];
            for(i = 0; i < array.length; i += 1) {
                if (array[i] === item) {
                    return array;
                }
            }
        }
    }
}
function getNextItem(items,item) {
  return items.findIndex(function(node,index){
    return node.previous_sibling_id == this.id;

  },item);
}
function getPrivousItem(items,item) {
  return items.findIndex(function(node,index){
    return node.id == this.previous_sibling_id;

  },item);
}
function getPrivousParent(items,item) {
  return items.findIndex(function(node,index){
    return node.next_node_id == this.id;
  },item);
}
/*
  this method assumes that ID are not trusted identifier to identify childes and parents and try check every item on the list to build the tree base on previous_sibling_id and next_node_id
 */
function parseTree(data)
{
  var parsedTree = {};
  // parsedTree.id = "INIT";
  parsedTree.children = [];
  parsedTree.tree_title = (!!data.tree_title) ? data.tree_title : 'Imported Tree - '+(new Date().toUTCString());

  function prepare(item,parent)
  {
    item.order = computeItemOrder(data.tree_nodes,item);
    if (!parent)
    {
      parent = parsedTree;
    }
    parent.children[item.order] = item;
    // >>>>>>>>>>>> right direction
    if (item.next_node_id)
    {
      parent = parent.children[item.order];
      if (!parent.children)
      {
        parent.children = [];
      }
      if ((chiledItemIndex = getItemIndexByID(data.tree_nodes,item.next_node_id)) >= 0)
      {
        prepare(data.tree_nodes[chiledItemIndex] ,parent);
      }

    }
    // |||||||||||| down direction
    if ((privousItemIndex = getNextItem(data.tree_nodes,item)) >= 0)
    {
      if (parent.id == item.id)
      {
        parent = findParent(parent,parent);
      }
      prepare(data.tree_nodes[privousItemIndex] ,parent);
    }
  }

  if(data.tree_nodes)
  {
    prepare(findRoot(data.tree_nodes,data.tree_nodes[0]));
    // data.tree_nodes.forEach(prepare);
  }
  /*
    reorder items
   */
  function reverseOrder(argument) {
    if (argument.children)
    {
      argument.children = argument.children.reverse();
      argument.children.map(reverseOrder);
    }
    return argument;
  }
  parsedTree.children = parsedTree.children.map(reverseOrder).reverse();
  return parsedTree;
}

module.exports = parseTree;