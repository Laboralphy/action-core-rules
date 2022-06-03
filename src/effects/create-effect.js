function createEffect (tag, amp = 0, data = {}) {
    return {
        tag,
        amp,
        duration: 0,
        source: 0,
        data
    }
}

module.exports = { createEffect }
