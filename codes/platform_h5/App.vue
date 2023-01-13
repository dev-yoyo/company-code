

<script>
import { isWxBrowser } from "@/common/hooks.js";

export default {
  data() {
    return {};
  },
  onLaunch: function () {
    // console.log("onlaunch");
    uni.setStorageSync("originUrl", location.href);
  },
  onShow() {
    // #ifdef H5
    if (isWxBrowser()) {
      console.log("at WxBrowser");
    } else {
      console.log("not at WxBrowser");
    }
    // #endif
  },
  onHide: function () {
    // console.log('App Hide')
  },
};
</script>

<style lang="scss">
@import "uview-ui/index.scss";

@import url("./static/common/css/com.scss");
@import url("./static/common/css/fontstyle.css");
@import url("./static/common/css/fontstyle_color.css");
@import url("./static/common/css/editor-icon.css");
@import url("./static/common/css/markdown.css");
</style>
