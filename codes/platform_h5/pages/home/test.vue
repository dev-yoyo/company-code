<template>
	<view class="content">
		<ly-markdown :showPreview="false" :textareaData.sync="textareaData" :textareaHtml.sync="textareaHtml"></ly-markdown>
	</view>
</template>

<script>
	import lyMarkdown from '@/components/markdown.vue'
	export default {
		components: {
			lyMarkdown
		},
		data: {
			textareaData: "",
			textareaHtml:"",
		},
		watch:{
			"textareaData":function(){
				console.log("markdown:"+this.textareaData)
				console.log("html:"+this.textareaHtml)
			}
		},
	}
</script>
