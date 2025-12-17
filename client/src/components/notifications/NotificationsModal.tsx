import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'Bem-vindo!',
    message: 'Aproveite promoções exclusivas e entregas rápidas.',
    timestamp: 'Agora',
    read: false,
  },
  {
    id: 2,
    title: 'Promoção em Bebidas',
    message: 'Desconto de 20% em bebidas selecionadas! Válido por 3 dias.',
    timestamp: '2 horas atrás',
    read: true,
  },
  {
    id: 3,
    title: 'Novo Produto Disponível',
    message: 'Confira nossos novos combos de bebidas especiais.',
    timestamp: '5 horas atrás',
    read: true,
  },
];

export function NotificationsModal({ open, onOpenChange }: NotificationsModalProps) {
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative text-foreground/70"
        onClick={() => onOpenChange(true)}
        data-testid="button-notifications-modal"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-panel border-primary/20 max-w-md" data-testid="modal-notifications">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notificações
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {NOTIFICATIONS.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhuma notificação</p>
            ) : (
              NOTIFICATIONS.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border transition-colors ${
                    notification.read
                      ? 'border-primary/10 bg-primary/5'
                      : 'border-primary/30 bg-primary/10'
                  }`}
                  data-testid={`notification-item-${notification.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground">{notification.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                </motion.div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
