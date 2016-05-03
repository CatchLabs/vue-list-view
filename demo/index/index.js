import './style.less';
import template from './template.html';

/* Placeholder Images from placeimg.com */
import nature1 from '../assets/nature1.jpg';
import nature2 from '../assets/nature2.jpg';
import nature3 from '../assets/nature3.jpg';
import nature4 from '../assets/nature4.jpg';
import nature5 from '../assets/nature5.jpg';
import nature6 from '../assets/nature6.jpg';


const IMAGES = [nature1, nature2, nature3, nature4, nature5, nature6];
const TITLES = [
    'Lorem ipsum dolor sit amet',
    'consectetur adipiscing elit',
    'sed do eiusmod tempor incididunt',
    'eu fugiat nulla pariatur',
    'officia deserunt mollit anim id est',
    'reprehenderit in voluptate velit esse'
];
const LENGTH = IMAGES.length;

import spinner from '../components/spinner';


/* Import ListView*/
import ListView from '../../lib/list-view';
/* The component(s) you may want to render in the list*/
import foo from '../components/foo/';

/* Define an itemComponent, which is the list item */
const itemComponent = {
    components: {foo},
    /* Put anything you want to render in the template */
    /* Don't forget to use the `item` prop */
    template: `
        <foo :foo-data="item"></foo>
    `
};

/* Initialize a listView component */
const listView = ListView(itemComponent);

export default {
    components: {
        listView, spinner
    },
    template,
    data: () => ({
        mode: 'normal',
        someListToRender: []
    }),
    methods: {
        loadMore() {
            setTimeout(this.addData, 500);
        },
        addData() {
            var newData = [];
            for (let i = 0; i < 5; i++) {
                newData.push(getRandomData());
                this.someListToRender = this.someListToRender.concat(newData);
            }
        }

    },
    events: {
        'list-view:scrolled-to-end'() {
            this.loadMore()
        }
    },
    created() {
        this.addData();
    },
    route: {
        data: ({to: {params: {mode = 'normal'}}}) => ({mode})
    }
};

function getRandomData() {
    return {
        title: TITLES[Math.floor(Math.random() * LENGTH)],
        img: IMAGES[Math.floor(Math.random() * LENGTH)]
    }
}