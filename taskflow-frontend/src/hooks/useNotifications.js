import { useState, useEffect, useCallback } from 'react'
import { notificationService } from '../services/notificationService'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const response = await notificationService.getNotifications()
      const list = response.data?.data || response.data || []
      setNotifications(Array.isArray(list) ? list : [])
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount()
      const data = response.data?.data || response.data
      setUnreadCount(typeof data === 'number' ? data : data?.count || 0)
    } catch (error) {
      console.error('Erreur lors du chargement du nombre de notifications:', error)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()
  }, [fetchNotifications, fetchUnreadCount])

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: new Date().toISOString() })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error)
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  }
}
