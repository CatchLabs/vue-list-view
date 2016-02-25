# ListView for Vue

## Inspired by
- https://github.com/emberjs/list-view
- Google plus web-app

## Features
- Auto GC/restore invisible/visible list items
- Does not modify the original data (the list or the items)

## Demo 


## Requirements
- vue 1.0+

## Usage
1. Define an `itemComponent`  
It's just a plain vue component object, except for it's `props` will
be force overridden to only accept an `item`, which is an item in
the list. So you should just leave the `props` option empty.
    ```javascript
    import foo from 'foo';
    const itemComponent = {
        template: '<foo :some-prop="item"></foo>',
        components: {foo}
    }
    ```
`itemComponent` serves as an **adaptor** for list data, for example, normally you would do
    ```html
    <foo v-for="item in listToRender" :some-prop="item">
    ```
The data is passed through `list -> v-for -> item -> foo`
With list-view, it is now
    ```html
    <list-view :items="listToRender">
      ...internal v-for for demonstration, you needn't write the following...
      <template v-for="item in items">
        <item-component :item="item">
          ...The is the template of itemComponent...
          <foo :some-prop="item"></foo>
          ...template end...
        </item-component>
      </template>
      ...internal v-for end...
    </list-view>
    ```
And The data is passed through `list -> listView -> item -> foo`

2. Instantiate a listView component object  
    ```javascript
    const listView = ListView(itemComponent)
    ```
You can of course give it some other name like `albumListView`.  

3. Add `listView` to some other component's `components` and use it in `template`
    ```javascript
    const someComponent = {
      template: '<list-view :items="myArr"></list-view>',
      components: {listView},
      data: () => ({
        myArr: [1,2,3]
      })
    }
    ```
or simply use it like
    ```javascript
    new Vue({
      el: 'body',
      components: {listView},
      template: '<list-view :items="myArr"></list-view>',
      data: {
        myArr: [1,2,3]
      }
    })
    ```

## ListView Component

### Props
- `items`  
The list to be rendered (`v-for`-ed)
- `preloadScreens`  
The preload margin measured in screen's height, set to 0 if you don't want preloading (not suggested) 

### Events
- `list-view:scrolled-to-end`  
Dispatched when scrolled to end, can be used as a signal to load more data

### Slots
- `list-start`, `list-end`  
Placed before/after the list, can be used to display a loading status