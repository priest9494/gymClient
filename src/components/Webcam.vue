<template>
    <div class="camera-frame">
        <video autoplay class="feed" v-show="isVideoShow"></video>
        <canvas v-show="!isVideoShow"></canvas>
        <button 
        v-if="isAddOperation || isEditOperation" 
        class="snap-button" 
        @click="takePicture">
            {{ isPictureTaken ? 'Отменить' : 'Сделать снимок' }}
        </button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'camera',
    props: {
        videoContent: String
    },
    computed: {
        ...mapGetters({
            isAddOperation: 'clientsFrame/isAddOperation',
            isEditOperation: 'clientsFrame/isEditOperation',
            isPictureTaken: 'clientsFrame/isPictureTaken',
            isVideoShow: 'clientsFrame/isVideoShow'
        })
    },
    methods: {
        init() {
            if('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
                let constrains = {
                    video: {
                        width: {
                            min: 640,
                            ideal: 1280,
                            max: 1920
                        },
                        height: {
                            min: 360,
                            ideal: 720, 
                            max: 1080
                        }
                    }
                }

                navigator.mediaDevices.getUserMedia(constrains).then(stream => {
                    const videoPlayer = document.querySelector('video')
                    videoPlayer.srcObject = stream
                    videoPlayer.play()
                })
            } else {
                console.log('Some problem with media')
            }
        },
        takePicture() {
            if(!this.isPictureTaken) {
                let ratio = (window.innerHeight < window.innerWidth) ? 16/9 : 9/16

                const picture = document.querySelector('canvas')
                picture.width = (window.innerHeight < 1280) ? window.innerWidth : 1280
                picture.height = window.innerWidth / ratio

                const ctx = picture.getContext('2d')
                ctx.imageSmoothingEnabled = true
                ctx.imageSmoothingQuality = 'high'
                ctx.drawImage(document.querySelector('video'), 0, 0, picture.width, picture.height)

                this.$store.commit('clientsFrame/setClientPhoto', picture.toDataURL())
            } else {
                this.$store.commit('clientsFrame/setClientPhoto', '')
            }
            
            this.$store.commit('clientsFrame/setIsPictureTaken', !this.isPictureTaken)
        }
    },
    created() {
        this.init();
    }
}
</script>

<style lang="scss" scoped>
.camera-frame {
    margin: 20px 0px 0px 10px;
    display: flex;
    flex-direction: column;

    .feed, canvas {
        box-shadow: 4px 4px 12px 0px black;
        max-width: 300px;
    }

    .snap-button {
        margin: 5px 40px 0px 40px;
    }
}

</style>