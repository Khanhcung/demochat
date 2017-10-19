<template>
    <div>
    <li class="list-group-item" :class="className"><slot></slot>
    <span id="time">{{ time }}</span></li>
    <div :class="badgeFloat"><small :class="badgeClass" style="font-size:14px;">{{ user }}</small></div>
    </div>
</template>

<script>
    export default {
        props:[
            'color',
            'user',
            'float',
            'time'
        ],
        computed:{
            className(){
                return 'list-group-item-'+this.color;
            },
            badgeClass(){
                return 'badge-'+this.color;
            },
            badgeFloat(){
                return 'badge float-'+this.float;
            }
        },
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
<style>
    #time{
        font-size: 9px;
        color:black;
        margin-top: 10px;
        margin-left: 10px;
    }
</style>