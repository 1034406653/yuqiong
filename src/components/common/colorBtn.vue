<template>
	<div :class="btnClassName" @click="handleBtnClick" @touchstart='handleTounchStart' @touchend='handleTounchEnd'>		
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: "ColorBtn",
		props: {
			btnClassName: {
				type: String,
				default: 'colorBtnBlue',
			},			
		},
		methods: {
			handleBtnClick() {
				this.$emit('handleBtnClick')
			},
			handleTounchStart() {
				if(this.btnClassName=='colorBtnBlue'){
					this.$emit('update:btnClassName', 'colorBtnBlueActive')
				}
				if(this.btnClassName=='colorBtnWhite'){
					this.$emit('update:btnClassName', 'colorBtnWhiteActive')
				}
				if(this.btnClassName=='colorBtnYellow'){
					this.$emit('update:btnClassName', 'colorBtnYellowActive')
				}
				
			},
			handleTounchEnd() {
				if(this.btnClassName=='colorBtnBlueActive'){
					this.$emit('update:btnClassName', 'colorBtnBlue')
				}
				if(this.btnClassName=='colorBtnWhiteActive'){
					this.$emit('update:btnClassName', 'colorBtnWhite')
				}
				if(this.btnClassName=='colorBtnYellowActive'){
					this.$emit('update:btnClassName', 'colorBtnYellow')
				}
				
			},
		}
	}
</script>

<style lang="scss">
	.colorBtnYellow {
		text-align: center;
		width: 100%;
		height: 90px;
		line-height: 90px;
		color: #fff;
		font-size: 36px;
		border-radius: 10px;
		background: linear-gradient(180deg, rgba(255, 205, 27, 1) 0%, rgba(255, 178, 0, 1) 100%);
		margin-right: 27.5px;
	}
	
	.colorBtnYellowActive {
		text-align: center;
		width: 100%;
		height: 90px;
		line-height: 90px;
		color: #fff;
		font-size: 36px;
		border-radius: 10px;
		background: linear-gradient(180deg, rgba(255, 205, 27, 1) 0%, rgba(255, 178, 0, 1) 100%);
		margin-right: 27.5px;
		opacity: 0.6;
	}
	
	.colorBtnBlue {
		text-align: center;
		width: 100%;
		height: 90px;
		line-height: 90px;
		color: #fff;
		font-size: 36px;
		border-radius: 10px;
		background: linear-gradient(180deg, rgba(96, 194, 247, 1) 0%, rgba(49, 153, 249, 1) 100%);
	}
	
	.colorBtnBlueActive {
		text-align: center;
		width: 100%;
		height: 90px;
		line-height: 90px;
		color: #fff;
		font-size: 36px;
		border-radius: 10px;
		background: linear-gradient(180deg, rgba(96, 194, 247, 1) 0%, rgba(49, 153, 249, 1) 100%);
		opacity: 0.6;
	}
	
	.colorBtnWhite {
		text-align: center;
		width: 100%;
		height: 90px;
		line-height: 90px;
		font-size: 36px;
		border-radius: 10px;
		color: #4DA5F7;
		border: 2px solid rgba(77, 165, 247, 1);
		background: #fff;
	}
	
	.colorBtnWhiteActive {
		text-align: center;
		width: 100%;
		height: 90px;
		line-height: 90px;
		font-size: 36px;
		border-radius: 10px;
		color: #4DA5F7;
		border: 2px solid rgba(77, 165, 247, 1);
		background: #fff;
		opacity: 0.6;
	}
</style>