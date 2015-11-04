/**
 * @file ListView for Vue, designed for long list with many items.
 * @version 0.3.0
 * @author Catch Team
 *
 * It's component based, so that we always follow Vue component's life cycle.
 *
 * Features:
 *   - Infinite loading
 *   - Data preloading
 *   - Auto GC and restore invisible / visible items
 *
 * Requirements:
 *   - Promise A+ polyfill
 *   - window.pageYOffset
 *   - Vue 1.0
 *
 * FAQ:
 *   Q: Why not use slot api?
 *   A: When using slot api, "Everything in the parent template is compiled in parent scope;
 *      everything in the child template is compiled in child scope."
 *      See also: http://vuejs.org/guide/components.html#Content_Distribution_with_Slots
 */

/**
 * Generate a new ListView component based on given params
 *
 * @constructor
 * @param {Object} options - Options to create a ListView
 * @param {Function} options.data - Function to resolve data for each item, receives page index and should return a Promise.
 *                                  You should resolve([]) if this item doesn't exists, and we will display <no-more>
 * @param {Object} options.components - Components for ListView
 * @param {Component} options.components.loading - Component to show if item is loading
 * @param {Component} options.components.empty - Component to show if no items
 * @param {Component} options.components.noMore - Component to show if there is no more items
 * @param {Component} options.components.item - Component for each item in ListView.
 *        Each item component will have 2 props passed, one is list-view-index (index starts from 0)
 *        The other is list-view-data (Note that this prop will be passed in async)
 */
function ListView(options) {
    options || (options = {});
    return {
        created: created,
        attached: attached,
        detached: detached,
        data: function () {
            return {
                isLoading: false,
                isEmpty: false,
                noMore: false, // no more items?
                items: []
            };
        },
        methods: {
            reset: reset,
            update: update,
            onscroll: onscroll,
            getPage: options.data,
            loadMore: loadMore
        },
        components: {
            loading: options.components.loading || {},
            noMore: options.components.noMore || {},
            empty: options.components.empty || {},
            item: options.components.item
        },
        template: require('./template.html')
    };
}

/**
 * GC invisible items and Restore visible items if necessary
 *
 * @private
 */
function update() {
    var vm = this;
    setTimeout(function() { // Nerver block!
        var els = vm.$el.querySelectorAll('.list-view-item');
        vm.items.forEach(function(item, index) {
            var rect = els[index].getBoundingClientRect();
            if ((rect.bottom < -5 * window.innerHeight) || (rect.top > window.innerHeight * 5)) {
                // It's invisible, should GC it
                if (!item.placeholder) {
                    vm.items.$set(index, {placeholder: rect, data: item.data, index: item.index});
                }
            } else {
                // It should be or going to be visible, restore it
                if (item.placeholder) {
                    vm.items.$set(index, {rect: rect, data: item.data, index: item.index});
                }
            }
        });
    }, 1);
}


/**
 * Handler for scroll event
 *
 * @private
 */
function onscroll() {
    this.update();
    var offset = window.innerHeight;
    if ((window.pageYOffset + window.innerHeight + offset) > document.body.scrollHeight) {
        this.loadMore();
    }
}

function loadMore() {
    var vm = this;
    if (vm.isLoading || vm.noMore) {
        return;
    }
    vm.isLoading = true;
    vm.currentPage++;
    vm.getPage(vm.currentPage).then(function(items) {
        vm.isLoading = false;
        if (items.length === 0) {
            if (vm.currentPage === 0) {
                vm.isEmpty = true;
            } else {
                vm.noMore = true;
            }
            return;
        }
        var len = vm.items.length;
        items.forEach(function(item, i) {
            var index = len + i;
            vm.items.$set(index, {index: index, data: item});
        });
    });

    setTimeout(function() {
        // preload next page and check is no more
        vm.getPage(vm.currentPage + 1).then(function(items) {
            if (items.length === 0) {
                vm.noMore = true;
            }
        });
    }, 100);
}

/**
 * Reset current status
 */
function reset() {
    this.currentPage = -1;
    this.items = [];
    this.noMore = false;
    this.isEmpty = false;
    this.loadMore();
}

function created() {
    this.currentPage = -1;
}

function attached() {
    this.onscroll = this.onscroll.bind(this);
    window.addEventListener('scroll', this.onscroll);
    this.update();
    this.loadMore();
}

function detached() {
    window.removeEventListener('scroll', this.onscroll);
}

module.exports = ListView;
