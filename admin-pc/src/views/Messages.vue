<template>
  <div class="body">
    <div class="top">
      <h2>健康资讯</h2>
    <div>
        <el-button @click="dialogVisible = true">新增</el-button>
        <el-input
          placeholder="请输入资讯标题"
          prefix-icon="el-icon-search"
          v-model="search"
          @change="toSearch"
        >
        </el-input>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="source" label="文章来源"></el-table-column>
      <el-table-column
        prop="desc"
        label="正文"
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
          <el-button
            style="margin-right: 20px"
            type="primary"
            @click="editItem(scope.row)"
            >编辑</el-button
          >
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
      } = await this.$http.post("/admin/getMessage", params);
      this.tableData = result;
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
    async deleteItem(_id) {
      const params1 = {
        _id,
      };
      const { data } = await this.$http.post("/admin/deleteMessage", params1);
      if (data === "success") {
        this.$message.success("删除成功！");
        this.getTableData();
      } else {
        this.$message.error("删除失败！");
      }
    },
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

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>