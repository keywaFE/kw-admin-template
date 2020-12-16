<template>
  <div>
    <ul>
      <li class="group" v-for='(item, key) in dataList' :label="item.title" :name="key" :key=key>
        <div class="title">{{item.title}}</div>
        <div class="app" v-for='items in item.value' :key=items.id>
          <router-link v-if='items.is_admin' class="edit-link" :to="'/apps/'+ items.id">
            <i class="el-icon-edit "></i>
          </router-link>
          <img class="logo" :src="config.baseUrl + items.thumb_url" alt="">
          <div class="info">
            <p class='name'>
              {{items.title}}
            </p>
            <p class="link-wrapper">
              <a :href="items.domain" class="link" target='_blank'>访问</a>
              <a :href="`/oauth/login/app?app_id=${items.id}&access_token=${token}`" class="link" target='_blank'>登录</a>
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { config } from '@/config'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      config,
      activeName: '',
      status: {},
      showBtn: false,
      showSwitch: ''
    }
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    dataList: {
      type: Array,
      default () {
        return []
      }
    },
    isAdmin: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  methods: {
    changeSwitch(row) {
      this.$app_disable({ id: row.id, status: row.status ? 1 : 0 }).then((res) => {
        if (res) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          // window.history.go(0)
        } else {
          this.$message.error('操作失败')
        }
      })
    }
  },
  watch: {
    dataList(newVal) {
      for (let key in newVal) {
        this.activeName = key
        break
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
p {
  margin: 0;
}
.title {
  margin-bottom: 14px;
  font-size: 18px;
  color: #4ea0fa;
}
.group {
  padding: 20px 20px 10px 20px;
  margin-bottom: 10px;
  background: #fff;
  border: solid 1px #e6e6e6;
  overflow: hidden;
  .app {
    float: left;
    display: flex;
    box-sizing: border-box;
    padding: 16px;
    position: relative;
    width: 240px;
    overflow: hidden;
    margin-right: 13px;
    margin-bottom: 13px;
    border: solid 1px #e6e6e6;
    &:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,.15);
    }
  }
  .edit-link {
    position: absolute;
    font-size: 20px;
    right: 6px;
    top: 6px;
    padding: 4px;
    color: #ccc;
    cursor: pointer;
    &:hover {
      color: #4ea0fa;
    }
  }
  .logo {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
  }
  .name {
    width: 120px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
}
.link-wrapper {
  padding-top: 8px;
  .link {
    display: inline-block;
    padding: 4px 10px;
    margin-right: 4px;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    border-radius: 3px;
    font-size: 12px;
    &:hover {
      color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
    }
  }
}

</style>
