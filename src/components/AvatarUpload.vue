<template>
  <div class="full-page">
    <div class="image-upload">
      <div class="image-container" style="width: 400px; height: 400px;">
        <img :src="displayImageUrl" alt="Image" class="image-preview" />
      </div>
      <el-upload class="el_upload_above" action="" ref="upload" :limit="limitnum" list-type="picture-card"
        :http-request="uploadSectionFile" :auto-upload="true" :file-list="fileList" :on-error="uploadFileError"
        :on-success="uploadFileSuccess" :on-exceed="exceedFile" :on-remove="removeFile">
      </el-upload>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uploadUrl: 'http://springboot_app:10086/common/upload', // 后端上传接口地址
      defaultImageUrl: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png', // 默认图片地址
      fileList: [],//上传的文件列表
      limitnum: 2,//最大允许上传个数 
    };
  },
  computed: {
    displayImageUrl() {
      // 先尝试使用 sessionStorage 中的 imageUrl
      const imageUrl = sessionStorage.getItem("avatar");
      if (imageUrl && this.checkImageUrl(imageUrl)) {
        return imageUrl;
      }
      // 如果 imageUrl 为空或者无法访问，则显示默认图片
      if (!imageUrl || !this.checkImageUrl(imageUrl)) {
        return this.defaultImageUrl;
      }
      return imageUrl;
    },
  },
  methods: {

    //自定义上传
    uploadSectionFile(param) {
      console.log("dfjkdgs");
      var fileObj = param.file;
      var form = new FormData();
      // 文件对象
      form.append("file", fileObj);
      axios.post('http://springboot_app:10086/common/upload', form).then(res => {
        param.onSuccess(res)
      }).catch(({ err }) => {
        param.onError(err)
      })
    },

    //上传失败
    uploadFileError(err, file, fileList) {
      this.$message.error("上传失败！")
    },
    //上传成功
    uploadFileSuccess(response, file, fileList) {
      if (response.data.code == 1) {
        file.response = response.data.data;
        this.fileList.push(file)
        const avatarUrl = response.data.data;
        console.log("上传成功，头像地址为：", avatarUrl);
        // 更新头像地址
        this.imageUrl = avatarUrl;
        // 存储新头像地址到sessionStorage
        sessionStorage.setItem("avatar", avatarUrl);

        // 根据用户类型选择更新学生或老师的头像信息的接口
        const updateUrl = sessionStorage.getItem("type") === 'teacher' || sessionStorage.getItem("type") === 'admin' ?
          'http://springboot_app:10086/teacher/updateAvatar' :
          'http://springboot_app:10086/student/updateAvatar';

        // 构造更新头像信息的请求参数
        let data = {};
        if (sessionStorage.getItem("type") === 'teacher' || sessionStorage.getItem("type") === 'admin') {
          data = {
            username: (sessionStorage.getItem("name")), // 老师name
            avatar: avatarUrl
          };
        } else {
          data = {
            username: (sessionStorage.getItem("name")),
            avatar: avatarUrl
          };
        }

        // 发送请求更新头像信息
        axios.post(updateUrl, data)
          .then(response => {
            if (response.data === true) {
              // 头像信息更新成功
              // 此处可以做一些成功提示或其他逻辑
              this.$message({
                showClose: true,
                message: '更新成功!',
                type: 'success'
              });
              console.log("头像上传成功！");
            } else {
              // 头像信息更新失败
              // 此处可以做一些失败提示或其他逻辑
              this.$message({
                showClose: true,
                message: '更新失败，请稍后再试！',
                type: 'error'
              });
              console.error("头像上传失败！");
            }
          })
          .catch(error => {
            console.error("更新头像信息失败:", error);
          });
      } else {
        this.$message.error(response.data.message);//文件上传错误提示
      }
    },
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      this.$message.error('只能上传' + this.limitnum + '个文件');
    },
    //删除文件
    removeFile(file, fileList) {
      this.fileList = fileList;
    },
    checkImageUrl(url) {
      // 创建一个 Image 对象来检查图片是否可以访问
      const img = new Image();
      img.src = url;
      return img.complete || img.width + img.height > 0;
    },
  },

};
</script>



<style scoped>
.full-page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-upload {
  display: flex;
  align-items: center;
}

.image-container {
  width: 100px;
  height: 100px;
  overflow: hidden;
  margin-right: 20px;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
}

.el-upload__text {
  margin-left: 10px;
}
</style>
