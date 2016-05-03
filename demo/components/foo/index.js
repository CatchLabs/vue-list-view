import './style.less';

export default {
    props: {
        fooData: {
            type: Object,
            default: () => ({
                title: '',
                img: ''
            })
        }
    },
    template: `
        <div class="foo">
            <img :src="fooData.img"/>
            <h1>{{ fooData.title }}</h1>
        </div>
    `
}