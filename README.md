# pdf-graffiti

### 一个pdf预览 + 涂鸦的工具

###### 基本使用
``` html
    npm i -S pdf-graffiti

    <template>
        <div>
            <PdfGraffiti :isEdit="isEdit" :pdfUrl="pdfUrl" />
        </div>
    </template>

    <script>
        import { PdfGraffiti } from 'pdf-graffiti'
        export default {
            components: {
                PdfGraffiti
            },
            data () {
                return {
                    isEdit: true,
                    pdfUrl: ''
                }
            }
        }
    </script>
    

```
###### props
| 属性名 | 描述 | 类型 | 是否必传|
|  ----  | ----  | ---- | ---- |
| v-model | 存储的数据, 通过save方法同步更新 | object: { isEmpty, data }</br>isEmpty: 是否是有效数据</br>data: 存储的数据数据，DataURL | 否 |
| isEdit | 是否处于编辑模式，需要 .sync 修饰符修饰 | boolean | 否 |
| pdfUrl | 需要渲染的pdf链接地址 | string | 否 |


###### 提供的基本接口
| 方法名称 | 描述  | 参数 | 参数类型 | 参数说明 | 返回值 |
|  ----  | ----  | ---- | ---- | ---- | ---- |
| render  | 渲染pdf | pdfurl | string | pdf地址 | 无
| undo  | 撤销一次绘制 | 无 | 无 | 无 | 无
| clear  | 清空画板 | 无 | 无 | 无 | 无
| eraser  | 切换颜色 | color | string | 需要切换颜色的十六进制 | 无
| save  | 保存当前绘制的数据 | 无 | 无 | 无 | 无
| importPdf  | 加载本地的pdf | 无 | 无 | 无 | 无
| exportAll  | 导出当前的pdf+涂鸦为png | 无 |无 | 无  | 无 
| exportNote  | 导出当前的涂鸦为png | 无 | 无 | 无 | 无
| toPageLocation  | 滚动到某一页 | page| number| 需要跳转的页码 | 无
| initNote  | 初始化涂鸦 | DataURL | string | save方法保存下来的data数据 | 无
| htmlToPdf  | 导出当前的pdf+涂鸦为PDF | fileName | string | 文件名称 | 无
### 基本示例
``` html
    <template>
        <div>
            <PdfGraffiti :isEdit="isEdit" :pdfUrl="pdfUrl" ref="MyPdfGraffiti" />
            <button @click="myUndo">撤销</button>
        </div>
    </template>

    <script>
        import { PdfGraffiti } from 'pdf-graffiti'
        export default {
            components: {
                PdfGraffiti
            },
            data () {
                return {
                    isEdit: true,
                    pdfUrl: ''
                }
            },
            methods: {
                myUndo () {
                    this.$refs.MyPdfGraffiti.undo()
                }
            }
        }
    </script>
```

###### 回调函数

| 方法名称 | 描述  | 返回值 | 参数说明 |
|  ----  | ---- | ---- | ---- |
| onSave | 保存完成的回调 | { isEmpty, data } | isEmpty:是否是有效数据</br>data: 保存的数据，DataURL
| onLoaded | 加载完成的回调 | pageNum | 当前pdf的页码数量
| onPageScroll | 监听页面滚动 | top | 滚动的scrollTop
### 基本示例
``` html
    <template>
        <div>
            <PdfGraffiti :isEdit="isEdit" :pdfUrl="pdfUrl" ref="MyPdfGraffiti" @onPageScroll="onMyPageScroll" />
            <button @click="myUndo">撤销</button>
        </div>
    </template>

    <script>
        import { PdfGraffiti } from 'pdf-graffiti'
        export default {
            components: {
                PdfGraffiti
            },
            data () {
                return {
                    isEdit: true,
                    pdfUrl: ''
                }
            },
            methods: {
                myUndo () {
                    this.$refs.MyPdfGraffiti.undo()
                },
                onMyPageScroll(top) {
                    console.log(top)
                }
            }
        }
    </script>
```
