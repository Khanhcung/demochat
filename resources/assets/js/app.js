
require('./bootstrap');

window.Vue = require('vue');
Vue.component('message', require('./components/message.vue'));

// for scroll chat
import Vue from 'vue'
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

// for notifications
import Toaster from 'v-toaster'
import 'v-toaster/dist/v-toaster.css'
Vue.use(Toaster, {timeout: 5000})
const app = new Vue({
    el: '#app',
    data:{
    	message:'',
    	chat:{
    		message:[],
            user:[],
            color:[],
            float:[],
            time:[]
    	},
        typing:'',
        numberOfUsers:0
    },
    watch:{
        message(){
            Echo.private('chat')
                .whisper('typing',{
                    name: this.message
                });
        }
    },
    methods:{
    	send(){
    		if (this.message.length !=0) {
    			this.chat.message.push(this.message);
                this.chat.color.push('success');
                this.chat.float.push('right');
                this.chat.user.push('you');
                this.chat.time.push(this.getTime());
                axios.post('/send', {
                message : this.message,
                chat:this.chat
                })
                .then (response => {
                console.log(response);
                this.message=''
                })
                .catch (error=> {
                console.log(error);
                });
    		}	
    	},
        getTime(){
            let time = new Date();
            return time.getHours()+':'+time.getMinutes();
        },
        getOldMessages(){
            axios.post('/getOldMessage')
                  .then(response => {
                    console.log(response);
                    if (response.data != '') {
                        this.chat = response.data;
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });
        },
        deleteSession(){
            axios.post('/deleteSession')
            .then(response=> this.$toaster.success('Chat history is deleted') );
        }
    },
    mounted(){
        this.getOldMessages();
        Echo.private('chat')
            .listen('ChatEvent', (e) =>{
                this.chat.message.push(e.message);
                this.chat.user.push(e.user);
                this.chat.color.push('warning');
                this.chat.float.push('left');
                this.chat.time.push(this.getTime());
                axios.post('/saveToSession',{
                    chat : this.chat
                })
                      .then(response => {
                      })
                      .catch(error => {
                        console.log(error);
                      });
                //console.log(e);
            })
            .listenForWhisper('typing', (e) => {
                if (e.name != '') {
                    this.typing = 'typing.....';
                }else{
                    this.typing = '';
                }
                
            });
            Echo.join(`chat`)
                .here((users) => {
                    this.numberOfUsers = users.length;
                    //console.log(users);
                })
                .joining((user) => {
                    this.numberOfUsers += 1;
                    this.$toaster.success(user.name+' joined the room!');
                    console.log(user.name);
                })
                .leaving((user) => {
                    this.numberOfUsers -= 1;
                    this.$toaster.warning(user.name+' left the room!');
                    console.log(user.name);
            });            
    }
});
