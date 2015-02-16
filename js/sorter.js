window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();
		
		function DataPoint(value) {
			this.value = value;
			this.active = false;
			this.toggleActive = function() {
				this.active = !this.active;
			}
		}
		
		function Plot() {
			var canvas = document.getElementById('myCanvas');
      		var context = canvas.getContext('2d');
			var plot = this;
			var defaultFillColor = "#8ED6FF";
			var activeFillColor = "#D73C2C";	
			this.population = 1000;	
			this.size = 0;
			this.speed = 1;
			this.data = new Array();
			this.add = function(value) {
				this.data.push(new DataPoint(value));
				this.size++;
			}
			this.getMax = function() {
				max = -1
				for (i = 0; i < this.data.length; i++) {
					current = this.data[i];	
					if (current.value > max) {
						max = current.value;
					}
				}
				return max;
			}
			this.setup = function() {
				for (i = 0; i < this.population; i++) {
					p.add(i);
				}
			}
			this.shuffle = function() {
				var currentIndex = this.data.length, temporaryValue, randomIndex;

				// While there remain elements to shuffle...
				while (0 !== currentIndex) {
				
					// Pick a remaining element...
					randomIndex = Math.floor(Math.random() * currentIndex);
					currentIndex -= 1;
					
					// And swap it with the current element.
					temporaryValue = this.data[currentIndex];
					this.data[currentIndex] = this.data[randomIndex];
					this.data[randomIndex] = temporaryValue;
				}
				this.drawPlot();
			}
			this.drawPlot = function() {
				context.clearRect(0, 0, canvas.width, canvas.height);
				barWidth = canvas.width / plot.size;
				height = canvas.height;
				max = plot.getMax();
				x = 0;
				for (i = 0; i < plot.data.length; i++) {
					point = plot.data[i];
					context.beginPath();
					context.rect(x, height - point.value / max * height, barWidth, point.value / max * height);
					if (point.active) {
						context.fillStyle = activeFillColor;
					} else {
						context.fillStyle = defaultFillColor;
					}
					context.fill();
					context.lineWidth = 1;
					context.strokeStyle = 'black';
					context.stroke();
					x += barWidth;
				}
			}
			/*this.bubbleSort = function() {
				this.doBubbleSortIteration(0,0,this.data.length-1,function(i,j){
					var t;
					if(plot.data[j].value > plot.data[j+1].value) {
						t = plot.data[j].value;
						plot.data[j].value = plot.data[j+1].value;
						plot.data[j+1].value = t; 
					}
					plot.data[i].toggleActive();
					plot.data[j].toggleActive();
					plot.drawPlot();
					plot.data[i].toggleActive();
					plot.data[j].toggleActive();
				});
			}
			this.doBubbleSortIteration = function(i,j,max,callback) {
				callback(i,j);
				if (++j >= max){
					j = 0;
					i++;
				}
				if (i < max) {
					setTimeout(function() { plot.doBubbleSortIteration(i,j,max,callback); }, this.speed);
				}
			}*/
			this.bubbleSort = function() {
				 this.bubbleSortOuterLoop(0, this.data.length - 1);
			}
			this.bubbleSortOuterLoop = function(i, passes) {
				if (i > this.data.length) return;
				setTimeout(function() {
					plot.bubbleSortInnerLoop(1);
					plot.bubbleSortOuterLoop(++i);
				}, this.speed);
			}
			this.bubbleSortInnerLoop = function(j) {
				if (j < this.data.length) {
					if (this.data[j].value < this.data[j - 1].value) {
						var temp = plot.data[j];
						plot.data[j] = plot.data[j - 1];
						plot.data[j - 1] = temp;
						plot.drawPlot();
					}
					this.bubbleSortInnerLoop(++j);
				} else {
					return;
				}
			}
			this.insertionSort = function() {
				 this.insertionSortOuterLoop(1, this.data.length - 1);
			}
			this.insertionSortOuterLoop = function(i, passes) {
				if (i >= passes) return;
				setTimeout(function() {
					plot.insertionSortInnerLoop(i, i);
					plot.insertionSortOuterLoop(++i);
				}, this.speed);

			}
			this.insertionSortInnerLoop = function(i, j) {
				if (j > 0 && plot.data[j] && plot.data[j - 1].value > plot.data[j].value) {
					var temp = plot.data[j];
					plot.data[j] = plot.data[j - 1];
					plot.data[j - 1] = temp;
					plot.drawPlot();
					this.insertionSortInnerLoop(i, --j);
					
				} else {
					return;
				}
			}
			this.selectionSort = function() {
				this.selectionSortOuterLoop(0, this.data.length - 1);
			}
			this.selectionSortOuterLoop = function(i, passes) {
				if (i > passes) return;
				setTimeout(function() {
					plot.selectionSortInnerLoop(i, i + 1, i);
					plot.selectionSortOuterLoop(++i);
				}, this.speed);
			}
			this.selectionSortInnerLoop = function(i, j, minIndex) {
				if (j < this.data.length) {
					if (this.data[j] && this.data[j].value < this.data[minIndex].value) {
						minIndex = j;	
					}
					this.selectionSortInnerLoop(i, ++j, minIndex)
				} else {
					if (minIndex != i) {
						var temp = plot.data[i];
						plot.data[i] = plot.data[minIndex];
						plot.data[minIndex] = temp;
						plot.drawPlot();
					}
					return;
				}
			}
			this.quickSort = function() {
				this.quickSortHelper(0, this.data.length-1, function(index) {
					plot.data[index].toggleActive();
					plot.drawPlot();
					plot.data[index].toggleActive();
				});
			}
			this.quickSortHelper = function(low, high, callback) {
				index = plot.partition(low, high);
				callback(index);
				if (low < index - 1) {
					plot.quickSortHelper(low, index - 1, callback);
				}
				if (high > index) {
					setTimeout(function() { plot.quickSortHelper(index, high, callback); }, this.speed * 2);
				} 
			}
			this.partition = function(left, right) {
				pivot = this.data[left].value;
				while (left <= right) {
					// searching  number which is greater than pivot, bottom up
					while(this.data[left].value < pivot) {
						left++;
					}
					// searching number which is less than pivot, top down
					while (this.data[right].value > pivot) {
						right--;
					}
					// swap values
					if (left <= right) {
						temp = this.data[left].value;
						this.data[left].value = this.data[right].value;
						this.data[right].value = temp;
						
						// increment left index and decrement right index
						left++;
						right--;	
					}
					this.drawPlot();
				}
				return left;
			}
			this.mergeSort = function() {
				this.data = this.mergeSortHelper(this.data);
				this.drawPlot();
			}
			this.mergeSortHelper = function(items) {
				// Terminal case: 0 or 1 item arrays don't need sorting
				if (items.length < 2) {
					return items;
				}
			
				var middle = Math.floor(items.length / 2),
					left    = items.slice(0, middle),
					right   = items.slice(middle);
				
				return this.merge(this.mergeSortHelper(left), this.mergeSortHelper(right));
			}
			this.merge = function(left, right) {
				var result  = [],
				il = 0,
				ir = 0;
			
				while (il < left.length && ir < right.length){
					if (left[il].value < right[ir].value){
						result.push(left[il++]);
					} else {
						result.push(right[ir++]);
					}
				}
			
				return result.concat(left.slice(il)).concat(right.slice(ir));
			}
		}