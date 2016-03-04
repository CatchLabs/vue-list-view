import throttle from 'lodash/throttle';
import fastdom from 'fastdom';
const innerHeight = window.innerHeight;

/**
 * ListView component constructor
 *
 * @param itemComponent - The component used as list item in v-for
 * @returns listView vue component object
 * @constructor
 */
export default function ListView(itemComponent = {template: ''}) {
    /* Force setting itemComponent's prop */
    itemComponent.props = {item: {type: Object}};
    return {
        template: `
            <div class="list-view" @scroll="scrollHandler" style="overflow-x: hidden">
                <slot name="list-start"></slot>
                <div v-for="item in items" class="list-view-item" :style="{height: placeholders[$index] + 'px'}">
                    <list-view-item v-if="visibility[$index]" :item="item"></list-view-item>
                </div>
                <slot name="list-end"></slot>
            </div>
        `,
        props: {
            items: {
                type: Array,
                required: true
            },
            preloadScreens: {
                type: Number,
                default: 3
            }
        },
        components: {
            listViewItem: itemComponent
        },
        data: () => ({
            placeholders: [],
            visibility: [],
            scrollHeight: 0
        }),
        methods: {
            scrollHandler: throttle(function () {
                /* Check if scrolled to end */
                var el = this.$el;
                if (el) {
                    fastdom.mutate(() => {
                        var scrollTop = el.scrollTop;
                        if (innerHeight + scrollTop >= this.scrollHeight) {
                            this.$dispatch('list-view:scrolled-to-end');
                        }
                    });
                    this.checkVisibility();
                }
            }, 1000),
            /* GC invisible items and Restore visible items if necessary */
            checkVisibility() {
                var preloadHeight = this.preloadScreens * innerHeight;
                var els = this.$el.querySelectorAll('.list-view-item');
                var visibility = this.visibility;
                fastdom.measure(() => {
                    var scrollTop = this.$el.scrollTop;
                    for (let i = 0, len = this.items.length; i < len; i++) {
                        fastdom.measure(() => {
                            if (els[i]) {
                                var top = els[i].offsetTop - scrollTop;
                                var bottom = top + this.placeholders[i];
                                visibility[i] = bottom > -preloadHeight && top < preloadHeight;
                                /* Trigger watcher */
                                if (i == len - 1) visibility.$set(0, visibility[0]);
                            }
                        });
                    }
                });
            }
        },
        watch: {
            items(items) {
                var placeholders = this.placeholders;
                var visibility = this.visibility;
                /* Re-initialize visibility table and bypass vue's watcher */
                for (let i = 0; i < items.length; i++) visibility[i] = true;
                /* Trigger watcher */
                visibility.$set(0, visibility[0]);

                /* Now vue has re-rendered the list and dom's ready */
                this.$nextTick(() => {
                    /* Cache scrollHeight */
                    fastdom.measure(() => this.scrollHeight = this.$el.scrollHeight);
                    setTimeout(() => {
                        var els = this.$el.querySelectorAll('.list-view-item');
                        for (let i = 0, len = els.length; i < len; i++) {
                            fastdom.measure(() => {
                                placeholders[i] = els[i].offsetHeight || null;
                                // Trigger watcher
                                if (i == len - 1) placeholders.$set(0, placeholders[0]);
                            })
                        }
                        this.checkVisibility();
                    }, 100);
                });
            }
        }
    };
}