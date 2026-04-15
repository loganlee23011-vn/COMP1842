<template>
  <div class="landing-page">
    <LandingNavbar />
    <main>
      <LandingHero />
      <LandingSteps />
      <LandingPreview />
      <LandingReviews />
    </main>
    <LandingFooter />
  </div>
</template>

<script>
import '../assets/landing.css'
import LandingFooter from '../components/landing/LandingFooter.vue'
import LandingHero from '../components/landing/LandingHero.vue'
import LandingNavbar from '../components/landing/LandingNavbar.vue'
import LandingPreview from '../components/landing/LandingPreview.vue'
import LandingReviews from '../components/landing/LandingReviews.vue'
import LandingSteps from '../components/landing/LandingSteps.vue'

export default {
  name: 'LandingView',
  components: {
    LandingNavbar,
    LandingHero,
    LandingSteps,
    LandingPreview,
    LandingReviews,
    LandingFooter,
  },
}
</script>
