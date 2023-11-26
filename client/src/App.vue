<template>
    <div class="container-fluid mt-4">

    <div class="row mb-4" :class="{'opacity': loadingInfo}">
        <div class="col-xl-4" v-for="(item ,key) in info" :key="key">
            <div class="alert" :class="'alert-' + item.color" role="alert">
                <div class="row">
                    <div class="row">
                        <div class="col">
                            <h5> {{item.title }} <AddressLink :link="item.address" route="address"/></h5>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <h6>TRX: {{item.trx}}</h6>
                    </div>
                    <div class="col">
                        <h6>Usdt: {{item.usdt}}</h6>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="firstLoading" class="text-center mb-4">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <div class="row">
        <div class="col-sm-6">
            <div class="card-block">
                <h5>Трейдеры</h5>
                <table class="table">
                    <thead>
                        <tr>
                        <th >#</th>
                        <th >Трейдер <EventButton v-if="!firstLoading" label="+" uri="/generateaddress/" @event="generateTrades"/></th>
                        <th >Private</th>
                        <th >USDT</th>
                        <th >TRX</th>
                        <th >Распределить</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="[key, item] in traders" :key="item.id">
                            <th>{{ item.id }}</th>
                            <td>{{ key }}</td>
                            <td style="word-break: break-all;">{{ item.privateKey }}</td>
                            <td>
                                {{ item.balanceUsdt }} 
                                <EventButton :label="`+${defaultAmount}`" uri="/sendusdt/" @event="sendUsdt" :body="{to: key, amount: defaultAmount}"/>
                            </td>
                            <td>
                                {{ item.balanceTrx }}
                                <EventButton :label="`+${defaultAmount}`" uri="/sendtrx/" @event="sendTrx" :body="{to: key, amount: defaultAmount}"/>
                            </td>
                            <td>
                                <EventButton label="Распределить" uri="/distribute/" @event="distribute" :body="{address: key, privateKey: traders.get(key).privateKey}"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="card-block">
                <h5>Тразакции</h5>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">From</th>
                            <th scope="col">To</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Type</th>
                            <th scope="col">TxId</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, key) in transactions" :key="key">
                            <td><AddressLink :link="item.from" route="address"/></td>
                            <td><AddressLink :link="item.to" route="address"/></td>
                            <td>{{ item.amount }}</td>
                            <td>{{ item.type }}</td>
                            <th><AddressLink :link="item.tx" route="transaction"/></th>
                        </tr>
                    </tbody>
                </table>
            </div>
            
        </div>
        <div class="alert alert-danger alert-fixed" v-if="textError != ''" >{{textError}} <span @click="textError = ''">&times;</span></div>
    </div>
</div>
</template>

<script lang="ts" setup>
    import { onMounted, ref, watch } from 'vue';
    import AddressLink from './components/AddressLink.vue'
    import EventButton from './components/EventButton.vue'

    import TronApi from './api/tron-api'

    const defaultAmount:number = 1
    let textError = ref('')
    const firstLoading = ref(true)
    const loadingInfo = ref(true)
    const traders = ref<any>(new Map())
    const transactions = ref<any>([])
    const info = ref<any>([])

    const addTransaction = (from:string, to:string, tx:string, amount:number, type:string) =>{
        transactions.value.push({from, to, tx, amount, type})
    }

    watch(textError, () => { setTimeout(() => textError.value = '', 5000)})

    const generateTrades = async (res:any) => {
        if(res.status){
            traders.value.set(res.result.address.base58, {
                id: traders.value.size+1,
                privateKey: res.result.privateKey,
                balanceUsdt: 0,
                balanceTrx: 0
            })
        }
    }

    const getInfo = async () => {
        loadingInfo.value = true
        const res = await TronApi.query('/getinfo/')
        loadingInfo.value = false
        firstLoading.value = false
        if(res.status){
            info.value = res.result
        }else{
            textError.value = res.result
        }
    }

    const sendUsdt = async (res:any) => {
        if(res.status){
            getInfo()
            traders.value.get(res.to).balanceUsdt += defaultAmount
            addTransaction(info.value[0].address, res.to, res.result, defaultAmount, 'USDT')
        }else{
            textError.value = res.result
        }
    }

    const sendTrx = async (res:any) => {
        if(res.status){
            getInfo()
            traders.value.get(res.to).balanceTrx += defaultAmount
            addTransaction(info.value[0].address, res.to, res.result.txid, defaultAmount, 'TRX')
        }else{
            textError.value = res.result
        }
    }

    const distribute = async (res:any) => {
        if(res.status){
            getInfo()
            traders.value.get(res.address).balanceUsdt = 0
            addTransaction(res.address, info.value[1].address, res.result.liquidity.tx, res.result.liquidity.amount, 'USDT')
            addTransaction(res.address, info.value[2].address, res.result.profit.tx, res.result.profit.amount, 'USDT')
        }else{
            textError.value = res.result
        }
    }

    onMounted( async ()=>{
        getInfo()
    })

</script>

