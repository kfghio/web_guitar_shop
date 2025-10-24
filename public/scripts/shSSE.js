
const eventSource = new EventSource('/events/updates');

eventSource.onmessage = ({ data }) => {
  const event = JSON.parse(data);
  console.log('[Клиент] Получено событие:', event);
  switch(event.type) {
    case 'product-created':
      toastr.success(`Создан product: ${event.data.name}`);
      break;
    case 'product-updated':
      toastr.info(`Обновлён product: ${event.data.name}`);
      break;
    case 'product-deleted':
      toastr.warning(`Удалён product: ${event.data.id}`);
      break;
    case 'review-created':
      toastr.success(`Создан review: ${event.data.comment}`);
      break;
    case 'review-updated':
      toastr.info(`Обновлён review: ${event.data.comment}`);
      break;
    case 'review-deleted':
      toastr.warning(`Удалён review: ${event.data.id}`);
      break;
    case 'user-created':
      toastr.success(`Создан usser: ${event.data.email}`);
      break;
    case 'user-updated':
      toastr.info(`Обновлён user: ${event.data.email}`);
      break;
    case 'user-deleted':
      toastr.warning(`Удалён user: ${event.data.id}`);
      break;
    case 'order-created':
      toastr.success(`Создан order: ${event.data.id}`);
      break;
    case 'order-updated':
      toastr.info(`Обновлён order: ${event.data.id}`);
      break;
    case 'order-deleted':
      toastr.warning(`Удалён order: ${event.data.id}`);
      break;
    case 'orderItem-created':
      toastr.success(`Создан orderItem: ${event.data.id}`);
      break;
    case 'orderItem-updated':
      toastr.info(`Обновлён orderItem: ${event.data.id}`);
      break;
    case 'orderItem-deleted':
      toastr.warning(`Удалён orderItem: ${event.data.id}`);
      break;
    case 'category-created':
      toastr.success(`Создан category: ${event.data.name}`);
      break;
    case 'category-updated':
      toastr.info(`Обновлён category: ${event.data.id}`);
      break;
    case 'category-deleted':
      toastr.warning(`Удалён category: ${event.data.id}`);
      break;
    case 'brand-created':
      toastr.success(`Создан бренд: ${event.data.name}`);
      break;
    case 'brand-updated':
      toastr.info(`Обновлён бренд: ${event.data.id}`);
      break;
    case 'brand-deleted':
      toastr.warning(`Удалён бренд: ${event.data.id}`);
      break;
  }
};