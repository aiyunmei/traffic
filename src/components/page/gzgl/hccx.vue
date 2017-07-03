<template>
  <div class="item" v-loading.fullscreen.lock="this.$store.state.loading">

    <div class="item-search">
      <el-collapse>
        <el-collapse-item name="1">
          <template slot="title">
            <el-button type="primary">搜索</el-button>
          </template>
          <div class="item-search-input">
            <el-row>
              <el-col :span="4">
                <el-select v-model="key" placeholder="请选择" style="width: 100%;" @change="keyChange">
                  <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item"></el-option>
                </el-select>
              </el-col>
              <el-col :span="4" v-for="(item,index) in parameterNameArr" :key="item">
                <el-input :placeholder="item" style="width: 100%;" v-model="params[`${item}`]" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="1">
                <el-button icon="search" type="primary" @click="search"></el-button>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="item-table">

      <div class="item-table-title">
        <h2>{{ this.$store.state.tableTitle.big }}<span>{{ this.$store.state.tableTitle.small }}</span></h2>
      </div>

      <div class="item-table-main">
        <ul>
          <li v-for="(item, index) in tableData">
            <el-tag type="primary">{{ index }}</el-tag>
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import { mapState } from 'vuex'
  export default {
    name: 'hccx',
    computed: mapState({
      carryLevelOptions: state => state.carryLevel,
      carryBodyTypeOptions: state => state.carryBodyType,
      carryFuelTypeOptions: state => state.carryFuelType
    }),
    data () {
      return {
        searchData: {
        },
        key: {},
        options: [],
        parameterNameArr: [],
        params: {},
        tableData: {}
      }
    },
    created () {
      this.$store.commit('setTableTitle', { big: '换乘优惠管理', small: '缓存查询' })
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
    },
    methods: {
      Result (formData) {
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.hccx.getInput, formData || {}).then((res) => {
          this.options = res.data.data.cacheKeyList
          this.$store.commit('setLoading', false)
        }).catch((err) => {
          console.log(err)
          this.$store.commit('setLoading', false)
        })
      },
      search () {
        let params = {
          key: this.key.key, dataType: this.key.dataType, parameterName: this.key.parameterName, parameterValue: ''
        }
        let arr = []
        for (let i in this.params) {
          arr.push(encodeURIComponent(this.params[i]))
        }
        params.parameterValue = arr.join(',')

        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.hccx.result, {params: params}).then((res) => {
          console.log(res.data.data)
          if (res.data.msg.code === '20000') {
            console.log(typeof res.data.data)
            this.tableData = typeof res.data.data === 'string' ? JSON.parse(res.data.data) : res.data.data
            this.$message({type: 'success', message: '查询成功'})
          } else if (res.data.msg.code === '40001') {
            this.$message({type: 'error', message: res.data.msg.message})
          } else {
            this.$message({type: 'error', message: '查询失败'})
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => {
          console.log(err)
          this.$store.commit('setLoading', false)
          this.$message({type: 'error', message: '网络错误'})
        })
      },
      keyChange (val) {
        console.log(val)
        this.params = {}
        this.parameterNameArr = val.parameterName.split(',')
        for (let i = 0; i < val.parameterCount; i++) {
          this.params[`${this.parameterNameArr[i]}`] = ''
        }
      }
    }
  }
</script>
