<template>
  <div class="center">
    <div class="error">
      <div class="number">4</div>
      <div class="illustration">
        <div class="circle"></div>
        <div class="clip">
          <div class="paper">
            <div class="face">
              <div class="eyes">
                <div class="eye eye-left"></div>
                <div class="eye eye-right"></div>
              </div>
              <div class="rosyCheeks rosyCheeks-left"></div>
              <div class="rosyCheeks rosyCheeks-right"></div>
              <div class="mouth"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="number">4</div>
    </div>

    <div class="text">Упс. Страница не существует.</div>
    <a class="btn-accent" href="/">На главную</a>
  </div>

</template>
<script setup lang="ts">
</script>
<style scoped lang="postcss">
@use postcss-simple-vars;
@use postcss-nested;

/* colors */
$blue: #293b49;
$pink: #fdabaf;
$pink-light: #ffe0e6;
$green: #04cba0;
$green-dark: #01ac88;
$white: white;

html,
body {
  height: 100%;
  margin: 0;
}
.btn-accent {
  font-size: 16px;
  margin-top: 30px;
  font-weight: 500;
  line-height: 21px;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  width: 219px;
  height: 50px;
  cursor: pointer;
  color: #fff;
  border: none;
  border-radius: 30px;
  background: #259BABFF ;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s;
}
.btn-accent:hover{
  background: #198a97;

}
html {
  font-size: 62.5%;
}

body {
  font-family: "Lato", sans-serif;
  font-size: 1.5rem;
  color: $blue;
}

a {
  text-decoration: none;
}

.center {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.error {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
}

.number {
  font-weight: 900;
  font-size: 15rem;
  line-height: 1;
  color: $blue;
}

.illustration {
  position: relative;
  width: 12.2rem;
  margin: 0 2.1rem;
}

.circle {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 12.2rem;
  height: 11.4rem;
  border-radius: 50%;
  background-color: $blue;
}

.clip {
  position: absolute;
  bottom: 0.3rem;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
  width: 12.5rem;
  height: 13rem;
  border-radius: 0 0 50% 50%;
}

.paper {
  position: absolute;
  bottom: -0.3rem;
  left: 50%;
  transform: translateX(-50%);
  width: 9.2rem;
  height: 12.4rem;
  border: 0.3rem solid $blue;
  background-color: $white;
  border-radius: 0.8rem;

  &::before {
    content: "";
    position: absolute;
    top: -0.7rem;
    right: -0.7rem;
    width: 1.4rem;
    height: 1rem;
    background-color: $white;
    border-bottom: 0.3rem solid $blue;
    transform: rotate(45deg);
  }
}

.face {
  position: relative;
  margin-top: 2.3rem;
}

.eyes {
  position: absolute;
  top: 0;
  left: 2.4rem;
  width: 4.6rem;
  height: 0.8rem;
}

.eye {
  position: absolute;
  bottom: 0;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background-color: $blue;
  animation-name: eye;
  animation-duration: 4s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;

  &-left {
    left: 0;
  }

  &-right {
    right: 0;
  }
}

@keyframes eye {
  0% {
    height: 0.8rem;
  }
  50% {
    height: 0.8rem;
  }
  52% {
    height: 0.1rem;
  }
  54% {
    height: 0.8rem;
  }
  100% {
    height: 0.8rem;
  }
}

.rosyCheeks {
  position: absolute;
  top: 1.6rem;
  width: 1rem;
  height: 0.2rem;
  border-radius: 50%;
  background-color: $pink;

  &-left {
    left: 1.4rem;
  }

  &-right {
    right: 1.4rem;
  }
}

.mouth {
  position: absolute;
  top: 3.1rem;
  left: 50%;
  width: 1.6rem;
  height: 0.2rem;
  border-radius: 0.1rem;
  transform: translateX(-50%);
  background-color: $blue;
}

.text {
  margin-top: 5rem;
  font-weight: 300;
  font-size: 22px;
  color: $blue;
}

.button {
  margin-top: 4rem;
  padding: 1.2rem 3rem;
  color: $white;
  background-color: $green;

  &:hover {
    background-color: $green-dark;
  }
}

.by {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  text-transform: uppercase;
  color: $blue;
}

.byLink {
  color: $green;
}
</style>
