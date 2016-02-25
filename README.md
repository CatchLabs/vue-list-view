# ListView for Vue

## Inspired by
- https://github.com/emberjs/list-view

## Features
- Auto GC/restore invisible/visible list items
- Does not modify the original data (the list or the items)

## Requirements
- vue 1.0+
- lodash 4.0+
- webpack 1.0+
- babel-loader 6.0+

## Usage
1.Define an `itemComponent`
  It's just a plain vue component object, except for it's `props` will
  be force overridden to only accept an `item`, which is an item in
  the list. So you should just leave the `props` option empty.
2.Instantiate a listView component object
  `const listView = ListView(itemComponent)`
  You can also give it some other name like `albumListView`.
3.Add listView to components and use it in template
 
## ListView Component
### Props
- items: the list to be rendered (`v-for`-ed)
- preloadScreens - The preload margin measured in screen's height
### Events:
- `list-view:scrolled-to-end`
  Dispatched when scrolled to end, can be used as a signal to load more data
### Slots:
- `list-start`, `list-end`
  Placed before/after the list, can be used to display a loading status