<template>
  <div class="body">
    <div class="top">
      <h2>健康菜谱</h2>
    <div>
        <el-button @click="dialogVisible = true">新增</el-button>
        <el-input
          placeholder="请输入菜谱名称"
          prefix-icon="el-icon-search"
          v-model="search"
          @change="toSearch"
        >
        </el-input>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="openid" label="OpenID"></el-table-column>
      <el-table-column prop="classify1" label="一级分类"></el-table-column>
      <el-table-column prop="classify2" label="二级分类"></el-table-column>
      <el-table-column prop="name" label="菜谱名称"></el-table-column>
      <el-table-column prop="food" label="菜谱食材"></el-table-column>
      <el-table-column
        prop="desc"
        label="菜谱做法"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="图片" width="120">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.imgList[0]"
            :preview-src-list="scope.row.imgList"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="发布时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-popconfirm
            title="是否确认删除该数据，经删除不可恢复！！！"
            @confirm="deleteItem(scope.row._id)"
          >
            <el-button slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  data() {
    return {
      tableData: [],
      page: 1,
      size: 5,
      total: 0,
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      const params = {
        page: this.page,
        size: this.size,
      };
      const {
        data: { result, total },
      } = await this.$http.post("/admin/getRecipes", params);
      this.tableData = result.map((item) => {
        return {
          ...item,
          time: dayjs(item.time).format("YYYY-MM-DD HH:mm:ss"),
        };
      });
      this.total = total;
    },
    handleSizeChange(val) {
      this.size = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getTableData();
    },
    async deleteItem(_id){
      const params1={
        _id
      };
      const {data} = await this.$http.post("/admin/deleteRecipes",params1);
      if(data==="success"){
        this.$message.success("删除成功！");
        this.getTableData();
      }else{
        this.$message.error("删除失败！");
      }
    }
  },
};
</script>

<style lang="less" scoped>
.body {
  padding: 20px;
  background-color: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .el-input {
      width: 300px;
      margin-left: 20px;
    }
  }

  .pagination{
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>