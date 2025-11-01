<template>
  <div class="image-upload-container">
    <el-upload
      class="image-uploader"
      :action="uploadUrl"
      :headers="headers"
      :show-file-list="false"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      :disabled="disabled"
    >
      <img v-if="imageUrl" :src="imageUrl" class="uploaded-image" />
      <i v-else class="el-icon-plus uploader-icon"></i>
    </el-upload>
    
    <div v-if="showTip" class="upload-tip">
      {{ tip || '只能上传jpg/png文件，且不超过2MB' }}
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth';

export default {
  name: 'ImageUpload',
  
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showTip: {
      type: Boolean,
      default: true
    },
    tip: {
      type: String,
      default: ''
    }
  },
  
  computed: {
    imageUrl() {
      if (this.value && !this.value.startsWith('http')) {
        return window.location.origin + this.value;
      }
      return this.value;
    },
    
    uploadUrl() {
      return process.env.VUE_APP_BASE_API + '/upload/image';
    },
    
    headers() {
      return {
        Authorization: 'Bearer ' + getToken()
      };
    }
  },
  
  methods: {
    handleSuccess(response) {
      if (response.code === 200) {
        this.$emit('input', response.data.url);
        this.$message.success('上传成功');
      } else {
        this.$message.error(response.message || '上传失败');
      }
    },
    
    handleError() {
      this.$message.error('上传失败');
    },
    
    beforeUpload(file) {
      const isImage = /^image\/(jpeg|jpg|png|gif|webp)$/.test(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      
      if (!isImage) {
        this.$message.error('只能上传图片文件');
        return false;
      }
      
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB');
        return false;
      }
      
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
.image-upload-container {
  .image-uploader {
    /deep/ .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s;
      
      &:hover {
        border-color: #409EFF;
      }
    }
    
    .uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 148px;
      height: 148px;
      line-height: 148px;
      text-align: center;
    }
    
    .uploaded-image {
      width: 148px;
      height: 148px;
      display: block;
      object-fit: cover;
    }
  }
  
  .upload-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
  }
}
</style>
