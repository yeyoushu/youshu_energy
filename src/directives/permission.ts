import type { Directive } from 'vue'
import { useUserStore } from '@/store/auth'

// v-permission="'roleName'" or v-permission="['roleA','roleB']"
const permission: Directive = {
    mounted(el, binding) {
        try {
            const userStore = useUserStore()
            const roles = userStore.roles || []
            const value = binding.value
            let allowed = false
            if (Array.isArray(value)) {
                allowed = value.some((v) => roles.includes(v))
            } else if (typeof value === 'string') {
                allowed = roles.includes(value)
            }
            if (!allowed) {
                // hide element if no permission
                el.style.display = 'none'
            }
        } catch (e) {
            // if store not available, hide to be safe
            el.style.display = 'none'
        }
    }
}

export default permission
