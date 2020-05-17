//List of values for quick picks
import { showTabulator } from "./tablib";
import { providers, listTypes } from "./setup";

var app = new Vue({
  el: "#app",
  data: {
    fields: [
      { label: "Id", name: "id", dataType: "number" },
      { label: "BatchId", name: "batchId", dataType: "number" },
      { label: "Bundle", name: "bundle", dataType: "number" },
      {
        label: "Source Service Provider",
        name: "sourceServiceProvider",
        dataType: "string"
      },
      {
        label: "Destination Service Provider",
        name: "destinationServiceProvider",
        dataType: "string"
      },
      { label: "Retries", name: "retries", dataType: "number" },
      { label: "ListType", name: "listype", dataType: "string" }
    ],
    operators: [
      { label: "=", value: "=", numberOfValues: 1 },
      { label: ">", value: ">", numberOfValues: 1 },
      { label: ">=", value: ">=", numberOfValues: 1 },
      { label: "<", value: "<", numberOfValues: 1 },
      { label: "<=", value: "<=", numberOfValues: 1 },
      { label: "between", value: "between", numberOfValues: 2 },
      { label: "in", value: "in", numberOfValues: 1 },
      { label: "isNull", value: "isNull", numberOfValues: 0 },
      { label: "isNotNull", value: "isNotNull", numberOfValues: 0 }
    ],
    allOwners: [],
    currentOwner: null,
    fieldSelected: "",
    operatorSelected: "",
    value1: "",
    value2: "",
    isValue1Visible: false,
    isValue2Visible: false,
    filterList: []
  },
  created: function() {
    console.log("View Creatred");
    this.allOwners = providers;
  },
  methods: {
    addFilter: function() {
      console.log("Add Filter : " + this.fieldSelected);
      const filterToAdd = {
        field: this.fieldSelected.name,
        operator: this.operatorSelected,
        value1: this.value1,
        value2: this.value2,
        isActive: true
      };
      //Check if filter already exists
      let filterExists = this.filterList.filter(
        o => o.field === this.fieldSelected.name
      ).length;
      if (filterExists > 0) {
        console.log("Filter exists..Updating");
        this.filterList = this.filterList.map(o =>
          o.field === this.fieldSelected.name ? filterToAdd : o
        );
      } else {
        this.filterList = [...this.filterList, filterToAdd];
      }
    },
    deleteFilter: function(field, event) {
      event.preventDefault();
      console.log("Request to delete filter " + field);
      //Use filter to remove array
      this.filterList = this.filterList.filter(o => o.field !== field);
    },
    removeFilters: function() {
      this.filterList = [];
    },
    onOperatorChange: function() {
      console.log("On Change:" + this.operatorSelected);
      const { numberOfValues } = this.operators.filter(
        o => o.label === this.operatorSelected
      )[0];

      this.isValue1Visible = numberOfValues > 0;
      this.isValue2Visible = numberOfValues > 1;

      if (!this.isValue1Visible) {
        this.value1 = "";
      }
      if (!this.isValue2Visible) {
        this.value2 = "";
      }
    },
    toggleFilterActive: function(field) {
      console.log("Filter Active Toggled = " + field);
      this.filterList = this.filterList.map(o =>
        o.field !== field ? o : { ...o, isActive: !o.isActive }
      );
    },
    search: function() {
      console.log("Ready to search...");
      console.log(this.filterList);
      showTabulator(this.filterList);
    }
  },
  computed: {
    addFilterButtonDisabled() {
      if (this.fieldSelected !== "" && this.operatorSelected !== "") {
        if (
          (this.isValue1Visible && this.value1 !== "") ||
          !this.isValue1Visible
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    quickValues() {
      let selectedFieldName = this.fieldSelected.name;
      if (this.isValue1Visible) {
        if (selectedFieldName === "listype") {
          return listTypes;
        } else if (
          selectedFieldName === "sourceServiceProvider" ||
          selectedFieldName === "destinationServiceProvider"
        ) {
          return providers.map(element => element.shortName);
        }
      }
    }
  }
});
