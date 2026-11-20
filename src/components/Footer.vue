<script setup lang="ts">
import Social from "./Social.vue";
import Link from "./Link.vue";
import Clickable from "./Clickable.vue";
import NotchSection from "./NotchSection.vue";
import { t } from "../i18n/utils/translate";
import ButtonRound from "./ButtonRound.vue";
import { lenis } from "../composables/useScroll";
import ArrowRightLong from "./icons/ArrowRightLong.vue";

interface Props {
  withSocial?: boolean;
}

const handleBackToTop = () => {
  if (!lenis.value) return;
  lenis.value.scrollTo(0);
};

const { withSocial = true } = defineProps<Props>();
</script>

<template>
  <footer class="footer">
    <NotchSection class="footer-notch" />
    <div class="footer-content">
      <div class="footer-top">
        <Social v-if="withSocial" />
        <div
          class="footer-back-to-top"
          tabindex="0"
          @click="handleBackToTop"
          @keydown.enter="handleBackToTop"
          data-cursor="circle-white"
          data-sound="click"
          aria-label="Back to top"
        >
          <ButtonRound renderAs="div" variant="border" class="children-unclickable" data-hoversound="hover">
            <ArrowRightLong class="footer-back-to-top-icon" />
          </ButtonRound>
        </div>
      </div>
      <div class="footer-credits">
        <div class="footer-credits-music">
          <p>
            {{ t("music-produced-by") }}
          </p>
          <Clickable renderAs="div">
            <Link
              href="https://soundcloud.com/hmsurf"
              class="footer-link children-unclickable"
              external
              data-cursor="circle-white"
              data-hoversound="hover"
              >HM Surf</Link
            >
          </Clickable>
        </div>
        <p>© {{ new Date().getFullYear() }} Lethin K J</p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: var(--color-background-300, var(--color-beige-400));
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;

  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xl);
    width: 100%;
    max-width: calc(var(--breakpoint-xxxl));
    padding: calc(var(--space-outer) + var(--space-sm)) var(--space-outer);
    position: relative;
  }

  &-top {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  &-back-to-top {
    cursor: pointer;
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    :deep(.button-round) {
      border: 2px solid var(--color-grayscale-400);
      color: var(--color-text-400);
      --icon-color: var(--color-text-400);
      background-color: transparent;

      &:hover {
        background-color: var(--color-hover, var(--color-black-400));
        color: var(--color-white-400);
        --icon-color: var(--color-white-400);
        border-color: var(--color-hover, var(--color-black-400));
      }
    }

    &-icon {
      transform: rotate(-90deg);
      color: var(--color-text-400);
    }
  }

  &-link {
    font-weight: 700;
  }

  &-credits {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm);
    width: 100%;
    font-size: var(--font-size-sm);
    text-align: center;

    &-built,
    &-music {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--space-xxs);
    }
  }

  &-notch {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-100%);
    color: var(--color-background-300, var(--color-beige-400));
    --icon-color: var(--color-background-300, var(--color-beige-400));
  }
}
</style>
