<template>
  <view>
    <!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
    <u-picker
      :show="show"
      ref="uPicker"
      :columns="addressColumns"
      @confirm="confirm"
      @cancel="cancel"
      @change="changeHandler"
    ></u-picker>
  </view>
</template>

<script>
// import address from "@/static/json/address.json";
// import address from "@/static/common/js/area.js";

export default {
  name: "area-selection",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      columnData: [
        // ["深圳", "厦门"],
        // ["得州", "纽约"],
      ],

      addressColumns: [],
      provinceArr: [], // 省
      cityArr: [], // 市
      areaArr: [], // 区
      provinceIndex: 0,
      cityIndex: 0,
    };
  },
  mounted() {
    // this.addressColumns = this.columns;
    // this.init();
  },
  watch: {
    columns: function (newValue, oldValue) {
      this.addressColumns = newValue;
      this.init();
    },
  },
  methods: {
    init() {
      let arr = this.addressColumns || [];
      let provinceArr = []; // 省
      let cityArr = []; // 省
      let areaArr = []; // 区
      let childrenList = [];

      if (arr.length <= 0) return;
      // 第一列
      arr.map((e, i) => {
        provinceArr.push(e.name);
        childrenList.push(e.children);

        // 第二列
        if (e.children && e.children.length > 0) {
          let arr1 = [];
          e.children.map((child2) => {
            arr1.push(child2.name);
          });
          cityArr.push(arr1);
        }
      });
      if (childrenList[0].length <= 0) return;
      childrenList[0].map((e) => {
        e.children.map((v) => {
          areaArr.push(v.name);
        });
      });

      this.addressColumns = [provinceArr, cityArr[0], areaArr];
      this.provinceArr = provinceArr;
      this.cityArr = cityArr;
      this.areaArr = areaArr;
      this.childrenList = childrenList;
    },

    changeHandler(e) {
      const {
        columnIndex,
        value,
        values, // values为当前变化列的数组内容
        index,
        // 微信小程序无法将picker实例传出来，只能通过ref操作
        picker = this.$refs.uPicker,
      } = e;
      // 当第一列值发生变化时，变化第二列(后一列)对应的选项

      if (columnIndex === 0) {
        this.provinceIndex = index;
        let area = [];
        let childList = this.childrenList[index];
        if (!childList || childList.length <= 0) return;
        if (!childList[0].children || childList[0].children.length <= 0) return;

        childList[0].children.map((v) => {
          area.push(v.name);
        });
        this.areaArr = area;

        picker.setColumnValues(1, this.cityArr[index]);
        picker.setColumnValues(2, this.areaArr);
      } else if (columnIndex === 1) {
        let area = [];
        this.areaArr = [];
        this.childrenList[this.provinceIndex][index].children.map((e) => {
          area.push(e.name);
        });
        this.areaArr = area;

        picker.setColumnValues(2, this.areaArr);
      }
    },
    // 回调参数为包含columnIndex、value、values
    confirm(e) {
      let newArr = this.dg([], this.columns, e.value);

      this.$emit("confirm", {
        ids: newArr,
        value: e.value,
        indexs: e.indexs,
      });
    },

    dg(ids, arr, value) {
      if (arr.length <= 0) return;

      arr.map((e) => {
        if (e.name == value[ids.length]) {
          ids.push(e.id);

          if (e.children && e.children.length > 0) {
            this.dg(ids, e.children, value);
          }
        }
      });

      return ids;
    },

    cancel() {
      this.$emit("cancel", false);
    },
  },
};
</script>