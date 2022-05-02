export default class Collider {
    static detectCollision(listA, listB, onCollision, ignoreBoard = false) {
        listA.forEach((objA) => {
            const collision = listB.filter((objB) =>
                Collider._haveCollided(objA, objB, ignoreBoard)
            );
            if (collision.length > 0) onCollision(objA, collision[0]);
        });
    }

    static _haveCollided = (objA, objB, ignoreBoard) => {
        if (objA.board && objB.board && !ignoreBoard) {
            return (
                objA.position.x < objB.position.x + objB.size.width &&
                objA.position.x + objA.size.width > objB.position.x &&
                objA.position.y < objB.position.y + objB.size.height &&
                objA.position.y + objA.size.height > objB.position.y &&
                objA.position.x < objB.position.x + objB.board.cellsWidth &&
                objA.position.x + objA.board.cellsWidth > objB.position.x &&
                objA.position.y < objB.position.y + objB.board.cellsHeight &&
                objA.position.y + objA.board.cellsHeight > objB.position.y
            );
        }
        return (
            objA.position.x < objB.position.x + objB.size.width &&
            objA.position.x + objA.size.width > objB.position.x &&
            objA.position.y < objB.position.y + objB.size.height &&
            objA.position.y + objA.size.height > objB.position.y
        );
    };
}