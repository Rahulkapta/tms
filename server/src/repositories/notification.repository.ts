
import { INotification, Notification } from '../models/notification.model';


export class NotificationRepository {
    // Create a new user
    async create(userData: Partial<INotification>) {
        return Notification.create(userData);
    }

  

} 