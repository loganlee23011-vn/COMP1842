<template>
  <section ref="sectionRef" class="landing-reviews" :class="{ 'is-visible': isVisible }">
    <div class="landing-container">
      <div class="reviews-header">
        <span class="badge">Feedback</span>
        <h2>What classmates think about IT Helply</h2>
      </div>

      <div class="reviews-grid">
        <article v-for="review in visibleReviews" :key="review.name" class="review-card">
          <div class="review-head">
            <div class="review-avatar">{{ initials(review.name) }}</div>
            <div>
              <strong>{{ review.name }}</strong>
              <p>{{ review.role }}</p>
            </div>
          </div>
          <p class="review-text">{{ review.comment }}</p>
        </article>
      </div>

      <div class="reviews-actions">
        <button
          v-if="!showAll"
          class="btn review-toggle"
          type="button"
          @click="showAll = true"
        >
          Show more
        </button>
        <button
          v-else
          class="btn review-toggle"
          type="button"
          @click="showAll = false"
        >
          I get the point
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'LandingReviews',
  data() {
    return {
      isVisible: false,
      observer: null,
      showAll: false,
      reviews: [
        {
          name: 'Phuckhanh',
          role: 'Coursework Reviewer',
          comment: 'The app feels complete because the response library, tickets, and reports all connect clearly in one workflow.',
        },
        {
          name: 'Thanh Thuy',
          role: 'Classmate Feedback',
          comment: 'I like that the system is easy to follow and the invitation flow makes the team feature feel more realistic.',
        },
        {
          name: 'Chan Khang',
          role: 'Project Viewer',
          comment: 'The quiz and response library are the strongest parts for the coursework because they show the original brief very clearly.',
        },
        {
          name: 'Ki Duy',
          role: 'UI Feedback',
          comment: 'The landing page explains the product well and the ticket workflow gives the whole app a more practical helpdesk feel.',
        },
        {
          name: 'Cong Phuc',
          role: 'System Review',
          comment: 'The agent and team invitation feature makes the project stand out beyond a normal CRUD assignment.',
        },
        {
          name: 'Thao Tien va Van Duc',
          role: 'Demo Review',
          comment: 'This version is easier to present in a video because each page has a clear purpose and the data flow is easy to explain.',
        },
      ],
    }
  },
  computed: {
    visibleReviews() {
      return this.showAll ? this.reviews : this.reviews.slice(0, 3)
    },
  },
  mounted() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true
        }
      },
      { threshold: 0.2 }
    )

    if (this.$refs.sectionRef) {
      this.observer.observe(this.$refs.sectionRef)
    }
  },
  beforeUnmount() {
    if (this.observer && this.$refs.sectionRef) {
      this.observer.unobserve(this.$refs.sectionRef)
    }
    if (this.observer) {
      this.observer.disconnect()
    }
  },
  methods: {
    initials(name) {
      return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    },
  },
}
</script>

<style scoped>
.landing-reviews {
  padding: 82px 0;
  background: #ffffff;
  opacity: 0;
  transform: translateY(34px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.landing-reviews.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.reviews-header {
  text-align: center;
  display: grid;
  gap: 14px;
  justify-items: center;
}

.reviews-header h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 52px);
}

.reviews-grid {
  margin-top: 42px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.review-card {
  background: #f8fafc;
  border: 1px solid #e6edf5;
  border-radius: 20px;
  padding: 22px;
  box-shadow: var(--shadow-sm);
}

.review-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.review-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2554ff 0%, #22c7c7 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.review-head p,
.review-text {
  margin: 0;
  color: var(--clr-muted);
  line-height: 1.7;
}

.reviews-actions {
  margin-top: 28px;
  text-align: center;
}

.review-toggle {
  background: #eef2ff;
  color: #1e3a8a;
  border: 1px solid #c7d2fe;
}

.review-toggle:hover {
  background: #e0e7ff;
}

@media (max-width: 900px) {
  .reviews-grid {
    grid-template-columns: 1fr;
  }
}
</style>
