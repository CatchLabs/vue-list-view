import './index.less';

import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
Vue.config.debug = true;

import ListView from '../lib/list-view';

import index from './index/index.js'

const map = {
    '/': {
        component: index
    },
    '/:mode': {
        component: index
    }
};

const router = new VueRouter();
router.map(map).start({}, 'body');