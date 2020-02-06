# JS-Samples

# multi-item-select-modal-1.0.js

## Getting Started

Setup:

```JS
<script src="multi-item-select-modal-1.0.js"></script>
```

```JS
var options = {
	data:AGAMiLabsEmployeeList
};
ESM.setup(options);
```

## Sample use:

i. Adding Trigger with only Post Callback method:

```JS
ESM.addTrigger('button_id', postcallback);
```

Example Implementation:

```JS
ESM.addTrigger('button_id', function(selectedDataAsArray){
	console.log("Post-Callback");
});
```

ii. Adding a Trigger with Pre && Post Callback methods:

```JS
ESM.addTrigger('button_id', precallback, postcallback);
```

Example Implementation:

```JS
ESM.addTriggerWithPreCallback('button_id', function(){
	console.log("Pre-Callback");
}, function(selectedDataAsArray){
	console.log("Post-Callback");
});
```
