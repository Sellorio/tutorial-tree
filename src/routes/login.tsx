import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '../pages/auth/LoginPage/LoginPage'

export const Route = createFileRoute('/login')({ component: LoginPage })
