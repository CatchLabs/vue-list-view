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
            <div class="list-view" @scroll="scrollHandler" style="overflow-x: hidden; overflow-y: auto">
                <slot name="list-start"></slot>
                <div v-for="item in items" class="list-view-item" :style="{height: placeholders[$index] + 'px'}">
                    <list-view-item v-if="placeholders[$index] == null" :item="item"></list-view-item>
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
            placeholders: []
        }),
        methods: {
            scrollHandler: throttle(function () {
                /* Check if scrolled to end */
                var el = this.$el;
                if (el) {
                    fastdom.measure(() => {
                        var scrollHeight = el.scrollHeight;
                        var scrollTop = el.scrollTop;
                        if (innerHeight + scrollTop >= scrollHeight) {
                            this.$dispatch('list-view:scrolled-to-end');
                        }
                    });
                    this.checkVisibility();
                }
            }, 500),
            /* GC invisible items and Restore visible items if necessary */
            checkVisibility() {
                var preloadScreens = this.preloadScreens;
                var els = this.$el.querySelectorAll('.list-view-item');
                var placeholders = this.placeholders;
                fastdom.measure(() => {
                    var innerHeight = window.innerHeight;
                    this.items.forEach((item, index) => {
                        fastdom.measure(() => {
                            var {top, bottom, height} = els[index].getBoundingClientRect();
                            if ((bottom < -preloadScreens * innerHeight) || (top > innerHeight * preloadScreens)) {
                                // It's invisible, should GC it
                                if (!placeholders[index]) placeholders.$set(index, height);
                            } else {
                                // It's going to be visible, restore it
                                if (placeholders[index]) placeholders.$set(index, null);
                            }
                        });
                    });
                });
            }
        },
        watch: {
            items(items) {
                this.placeholders = items.map(i => null);
                this.checkVisibility();
            }
        }
    };
}